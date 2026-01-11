import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUserById } from '../../hooks/api/useUser';
import { useGetUserInteractions } from '../../hooks/api/useUserInteraction';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { formatToVietnamTime } from '../../utils/dateUtils';
import { toast } from 'react-toastify';

const InteractionHistoryView: React.FC = () => {
    const userInfo = useSelector((state: any) => state.userLogin?.userInfo);
    const userId = userInfo?._id || userInfo?.id || '';

    const [page, setPage] = React.useState(1);
    const pageSize = 20;

    const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);

    const { data: interactionsData, isLoading: isLoadingInteractions } = useGetUserInteractions({
        page,
        page_size: pageSize,
    });

    React.useEffect(() => {
        if (!userId) {
            toast.info('Please login to view your interaction history');
        }
    }, [userId]);

    if (!userId) {
        return null;
    }

    const getInteractionColor = (type: string) => {
        switch (type) {
            case 'view':
                return 'default';
            case 'like':
                return 'secondary';
            case 'cart':
                return 'primary';
            case 'purchase':
                return 'primary';
            case 'review':
                return 'default';
            default:
                return 'default';
        }
    };

    const user = userData?.data?.user;
    const interactionHistory = (user as any)?.interactionHistory || (user as any)?.interaction_history || [];
    const allInteractions = interactionsData?.data?.interactions || [];
    const totalPages = interactionsData?.data?.pages || 1;

    return (
        <Box style={{ padding: '24px' }}>
            <Typography variant="h5" gutterBottom>
                Interaction History
            </Typography>

            {isLoadingUser || isLoadingInteractions ? (
                <Box display="flex" justifyContent="center" padding={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box marginBottom={4}>
                        <Typography variant="h6" gutterBottom>
                            From User Profile ({interactionHistory.length} items)
                        </Typography>
                        <TableContainer component={Paper} style={{ marginBottom: '24px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Interaction Type</TableCell>
                                        <TableCell>Timestamp</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {interactionHistory.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                No interactions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        interactionHistory.map((interaction: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{interaction.product_id}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={interaction.interaction_type}
                                                        color={getInteractionColor(interaction.interaction_type)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {formatToVietnamTime(interaction.timestamp)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            All Interactions from Collection ({interactionsData?.data?.count || 0} total)
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Interaction Type</TableCell>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Timestamp</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allInteractions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No interactions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        allInteractions.map((interaction: any) => (
                                            <TableRow key={interaction.id}>
                                                <TableCell>{interaction.id.substring(0, 8)}...</TableCell>
                                                <TableCell>{interaction.product_id}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={interaction.interaction_type}
                                                        color={getInteractionColor(interaction.interaction_type)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {interaction.rating ? `⭐ ${interaction.rating}` : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatToVietnamTime(interaction.timestamp)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" marginTop={2}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default InteractionHistoryView;

