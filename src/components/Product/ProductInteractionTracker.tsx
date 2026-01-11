import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetUserInteractions,
    useCreateUserInteraction,
    useUpdateInteraction,
} from '../../hooks/api/useUserInteraction';
import { useGetUserById } from '../../hooks/api/useUser';
import { Button, Box, Typography, Chip, CircularProgress } from '@material-ui/core';
import { toast } from 'react-toastify';
import { FaEye, FaHeart, FaShoppingCart, FaShoppingBag, FaStar } from 'react-icons/fa';

interface ProductInteractionTrackerProps {
    productId: string | number;
    onInteractionChange?: (interactionType: string) => void;
    showStats?: boolean;
    compact?: boolean;
}

const ProductInteractionTracker: React.FC<ProductInteractionTrackerProps> = ({
    productId,
    onInteractionChange,
    showStats = false,
    compact = false,
}) => {
    const userInfo = useSelector((state: any) => state.userLogin?.userInfo);
    const userId = userInfo?._id || userInfo?.id || '';

    const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);

    const { data: interactionsData } = useGetUserInteractions(
        showStats ? { page: 1, page_size: 10 } : undefined
    );

    const createInteraction = useCreateUserInteraction();

    const updateInteraction = useUpdateInteraction(userId);

    const user = userData?.data?.user;
    const interactionHistory = (user as any)?.interactionHistory || (user as any)?.interaction_history || [];
    const currentInteraction = interactionHistory.find(
        (ih: any) => String(ih.product_id || ih.productId) === String(productId)
    );

    const [lastAction, setLastAction] = useState<string>('');

    useEffect(() => {
        if (!userId && !compact) {
            toast.info('Please login to track your product interactions');
        }
    }, [userId, compact]);

    useEffect(() => {
        if (lastAction && !compact) {
            toast.success(`Last action: ${lastAction.toUpperCase()} - Success!`);
        }
    }, [lastAction, compact]);

    useEffect(() => {
        if (userId && productId) {
            updateInteraction.mutate(
                {
                    product_id: productId,
                    interaction_type: 'view',
                },
                {
                    onSuccess: () => {
                        setLastAction('view');
                        onInteractionChange?.('view');
                    },
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, userId]);

    const handleInteraction = (interactionType: 'like' | 'cart' | 'purchase' | 'review') => {
        if (!userId) {
            alert('Please login to interact with products');
            return;
        }

        if (interactionType === 'review') {
            createInteraction.mutate(
                {
                    product_id: productId,
                    interaction_type: 'review',
                    rating: 5,
                    user_id: userId,
                },
                {
                    onSuccess: () => {
                        setLastAction('review');
                        onInteractionChange?.('review');
                    },
                }
            );
        } else {
            updateInteraction.mutate(
                {
                    product_id: productId,
                    interaction_type: interactionType,
                },
                {
                    onSuccess: () => {
                        setLastAction(interactionType);
                        onInteractionChange?.(interactionType);
                    },
                }
            );
        }
    };

    if (compact && !userId) {
        return null;
    }

    if (!userId) {
        return null;
    }

    const isLoading = updateInteraction.isPending || createInteraction.isPending;
    const hasError = updateInteraction.isError || createInteraction.isError;
    const errorMessage =
        updateInteraction.error?.message || createInteraction.error?.message || '';

    useEffect(() => {
        if (hasError && errorMessage) {
            toast.error(errorMessage);
        }
    }, [hasError, errorMessage]);

    return (
        <Box style={{ padding: compact ? '8px' : '16px', border: compact ? 'none' : '1px solid #e0e0e0', borderRadius: '8px' }}>
            {!compact && (
                <Typography variant="h6" gutterBottom>
                    Product Interactions
                </Typography>
            )}

            {isLoadingUser && !compact && (
                <Box display="flex" alignItems="center" style={{ gap: 8 }} marginBottom={2}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Loading user data...</Typography>
                </Box>
            )}

            {currentInteraction && !compact && (
                <Box marginBottom={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Current Interaction:
                    </Typography>
                    <Chip
                        label={currentInteraction.interaction_type.toUpperCase()}
                        color="primary"
                        size="small"
                        style={{ marginRight: '8px' }}
                    />
                    <Typography variant="caption" color="textSecondary">
                        {new Date(currentInteraction.timestamp).toLocaleString()}
                    </Typography>
                </Box>
            )}

            <Box display="flex" flexWrap="wrap" style={{ gap: 8 }} marginBottom={2}>
                <Button
                    variant="outlined"
                    startIcon={<FaHeart />}
                    onClick={() => handleInteraction('like')}
                    disabled={isLoading}
                    color={currentInteraction?.interaction_type === 'like' ? 'primary' : 'default'}
                    size={compact ? 'small' : 'medium'}
                >
                    Like
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<FaShoppingCart />}
                    onClick={() => handleInteraction('cart')}
                    disabled={isLoading}
                    color={currentInteraction?.interaction_type === 'cart' ? 'primary' : 'default'}
                    size={compact ? 'small' : 'medium'}
                >
                    Add to Cart
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaShoppingBag />}
                    onClick={() => handleInteraction('purchase')}
                    disabled={isLoading}
                    size={compact ? 'small' : 'medium'}
                >
                    Purchase
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<FaStar />}
                    onClick={() => handleInteraction('review')}
                    disabled={isLoading}
                    color={currentInteraction?.interaction_type === 'review' ? 'primary' : 'default'}
                    size={compact ? 'small' : 'medium'}
                >
                    Review (5★)
                </Button>
            </Box>

            {isLoading && (
                <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Processing...</Typography>
                </Box>
            )}

            {showStats && interactionsData && (
                <Box marginTop={2} padding={1} bgcolor="#f5f5f5" borderRadius={1}>
                    <Typography variant="body2" gutterBottom>
                        Total Interactions: {interactionsData.data?.count || 0}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Showing {interactionsData.data?.interactions.length || 0} of{' '}
                        {interactionsData.data?.count || 0} interactions
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProductInteractionTracker;