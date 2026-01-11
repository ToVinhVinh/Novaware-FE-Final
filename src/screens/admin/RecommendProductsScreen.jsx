import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Chip,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import ProductCard from "../../components/Product/ProductCard";
import {
  useTrainGNNModel,
  useTrainCBFModel,
  useTrainHybridModel,
  useGNNModelRecommendations,
  useCBFModelRecommendations,
  useHybridModelRecommendations,
  useTrainGNNModelWithTaskId,
} from "../../hooks/api/useRecommend";
import { getScoreChip } from "../../utils/chipUtils.jsx";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    paddingTop: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
    marginTop: 0,
  },
  paper: {
    padding: theme.spacing(3),
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
  formContainer: {
    marginTop: theme.spacing(3),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: "flex",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  resultsContainer: {
    marginTop: theme.spacing(3),
  },
  recommendationCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  tabPanel: {
    border: `1px solid ${theme.palette.divider}`,
    borderTop: "none",
  },
  matrixContainer: {
    marginTop: theme.spacing(3),
    width: "100%",
  },
  matrixTableContainer: {
    marginTop: theme.spacing(2),
    maxHeight: 600,
    overflowX: "auto",
    overflowY: "auto",
    width: "100%",
    "&::-webkit-scrollbar": {
      height: 8,
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.grey[100],
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.grey[400],
      borderRadius: 4,
      "&:hover": {
        backgroundColor: theme.palette.grey[500],
      },
    },
  },
  matrixTable: {
    minWidth: "max-content",
  },
  matrixCell: {
    textAlign: "center",
    fontFamily: "monospace",
    fontSize: "0.75rem",
    padding: theme.spacing(1),
  },
  matrixHeaderCell: {
    position: "sticky",
    left: 0,
    zIndex: 2,
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    borderRight: `2px solid ${theme.palette.divider}`,
    fontSize: "0.75rem",
    padding: theme.spacing(1),
  },
}));

const ReasonList = ({ reason }) => {
  if (!reason) {
    return null;
  }

  const reasons = reason.split(';').map(r => r.trim()).filter(r => r);

  return (
    <Box style={{ margin: '8px 0 0 0', paddingLeft: 0, fontSize: '14px', color: 'rgba(0, 0, 0, 0.54)' }}>
      {reasons.map((r, index) => (
        <Box key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
          <span style={{ marginRight: 8, marginTop: 1 }}>•</span>
          <span>{r.endsWith('.') ? r : `${r}.`}</span>
        </Box>
      ))}
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const RecommendProductsScreen = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [topKPersonal, setTopKPersonal] = useState(5);
  const [topKOutfit, setTopKOutfit] = useState(4);
  const [alpha, setAlpha] = useState(0.5);
  const [trainingResults, setTrainingResults] = useState({
    gnn: null,
    cbf: null,
    hybrid: null,
  });

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  // Training hooks
  const trainGNN = useTrainGNNModel();
  const trainCBF = useTrainCBFModel();
  const trainHybrid = useTrainHybridModel();

  // Check status hook
  const checkStatus = useTrainGNNModelWithTaskId();

  // Recommendation hooks
  const getGNNRecommendations = useGNNModelRecommendations();
  const getCBFRecommendations = useCBFModelRecommendations();
  const getHybridRecommendations = useHybridModelRecommendations();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCurrentModelType = () => {
    switch (tabValue) {
      case 0:
        return "gnn";
      case 1:
        return "cbf";
      case 2:
        return "hybrid";
      default:
        return "gnn";
    }
  };

  const handleTrain = async (modelType) => {
    try {
      let result;
      switch (modelType) {
        case "gnn":
          result = await trainGNN.mutateAsync({ force_retrain: true });
          break;
        case "cbf":
          result = await trainCBF.mutateAsync({ force_retrain: true });
          break;
        case "hybrid":
          result = await trainHybrid.mutateAsync({
            force_retrain: true,
            alpha: alpha,
          });
          break;
        default:
          return;
      }
      setTrainingResults((prev) => ({
        ...prev,
        [modelType]: result,
      }));
      toast.success(`${modelType.toUpperCase()} model training completed!`);
    } catch (error) {
      toast.error(error?.message || `Failed to train ${modelType.toUpperCase()} model`);
    }
  };

  const handleCheckStatus = async (modelType) => {
    const trainingResult = trainingResults[modelType];
    if (!trainingResult || !trainingResult.task_id) {
      toast.error("No task ID available. Please train the model first.");
      return;
    }

    try {
      const result = await checkStatus.mutateAsync({
        task_id: trainingResult.task_id,
      });

      // Update training result with new status
      setTrainingResults((prev) => ({
        ...prev,
        [modelType]: result,
      }));

      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to check status");
    }
  };

  const handleGetRecommendations = async (modelType) => {
    if (!userId || !productId) {
      toast.error("Please enter both User ID and Product ID");
      return;
    }

    // Validate input ranges
    if (topKPersonal < 1 || topKPersonal > 50) {
      toast.error("Top K Personal must be between 1 and 50");
      return;
    }

    if (topKOutfit < 1 || topKOutfit > 10) {
      toast.error("Top K Outfit must be between 1 and 10");
      return;
    }

    if (modelType === "hybrid" && (alpha < 0 || alpha > 1)) {
      toast.error("Alpha must be between 0.0 and 1.0");
      return;
    }

    try {
      const requestData = {
        user_id: userId,
        current_product_id: productId,
        top_k_personal: topKPersonal,
        top_k_outfit: topKOutfit,
      };

      let result;
      switch (modelType) {
        case "gnn":
          result = await getGNNRecommendations.mutateAsync(requestData);
          break;
        case "cbf":
          result = await getCBFRecommendations.mutateAsync(requestData);
          break;
        case "hybrid":
          result = await getHybridRecommendations.mutateAsync({
            ...requestData,
            alpha: alpha,
          });
          break;
        default:
          return;
      }
      toast.success("Recommendations retrieved successfully!");
    } catch (error) {
      toast.error(error?.message || `Failed to get ${modelType.toUpperCase()} recommendations`);
    }
  };

  const renderMatrix = (matrixData) => {
    if (!matrixData || !matrixData.data || !matrixData.user_ids || !matrixData.product_ids) {
      return null;
    }

    const { data, user_ids, product_ids, description, row_label, col_label } = matrixData;

    // Chỉ hiển thị một số cột đầu và cuối
    const maxDisplayCols = 3; // Số cột hiển thị ở đầu và cuối
    const totalCols = product_ids.length;
    const showEllipsis = totalCols > maxDisplayCols * 2;

    // Các cột cần hiển thị
    const firstCols = product_ids.slice(0, maxDisplayCols);
    const lastCols = showEllipsis ? product_ids.slice(-maxDisplayCols) : [];

    // Hàm để lấy giá trị từ row dựa trên col index
    const getRowValue = (row, colIdx) => {
      return row[colIdx];
    };

    return (
      <Box className={classes.matrixContainer}>
        <Typography variant="h5" gutterBottom>
          {description || "User-Item Interaction Matrix"}
        </Typography>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          Shape: {matrixData.shape?.[0]} x {matrixData.shape?.[1]} |
          Displaying: {user_ids.length} rows x {showEllipsis ? `${maxDisplayCols} + ... + ${maxDisplayCols}` : totalCols} columns
        </Typography>
        <TableContainer
          component={Paper}
          className={classes.matrixTableContainer}
        >
          <Table
            className={classes.matrixTable}
            size="small"
            stickyHeader
            aria-label="matrix table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.matrixHeaderCell}
                  style={{ minWidth: 120 }}
                  component="th"
                  scope="row"
                >
                  {row_label || "User ID"}
                </TableCell>
                {/* Hiển thị các cột đầu */}
                {firstCols.map((productId, idx) => (
                  <TableCell
                    key={idx}
                    className={classes.matrixCell}
                    style={{ minWidth: 100 }}
                    align="center"
                  >
                    {productId.substring(0, 10)}...
                  </TableCell>
                ))}
                {/* Hiển thị "..." nếu có nhiều cột */}
                {showEllipsis && (
                  <TableCell
                    className={classes.matrixCell}
                    style={{ minWidth: 60 }}
                    align="center"
                  >
                    ...
                  </TableCell>
                )}
                {/* Hiển thị các cột cuối */}
                {lastCols.map((productId, idx) => (
                  <TableCell
                    key={`last-${idx}`}
                    className={classes.matrixCell}
                    style={{ minWidth: 100 }}
                    align="center"
                  >
                    {productId.substring(0, 10)}...
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIdx) => (
                <TableRow key={rowIdx} hover>
                  <TableCell
                    className={classes.matrixHeaderCell}
                    style={{ minWidth: 120 }}
                    component="th"
                    scope="row"
                  >
                    {user_ids[rowIdx]?.substring(0, 12)}...
                  </TableCell>
                  {/* Hiển thị giá trị các cột đầu */}
                  {firstCols.map((_, idx) => {
                    const value = getRowValue(row, idx);
                    return (
                      <TableCell
                        key={idx}
                        className={classes.matrixCell}
                        align="center"
                      >
                        {value === 0 ? "0.0" : value.toFixed(1)}
                      </TableCell>
                    );
                  })}
                  {/* Hiển thị "..." nếu có nhiều cột */}
                  {showEllipsis && (
                    <TableCell
                      className={classes.matrixCell}
                      align="center"
                    >
                      ...
                    </TableCell>
                  )}
                  {/* Hiển thị giá trị các cột cuối */}
                  {lastCols.map((_, idx) => {
                    const actualIdx = totalCols - maxDisplayCols + idx;
                    const value = getRowValue(row, actualIdx);
                    return (
                      <TableCell
                        key={`last-${idx}`}
                        className={classes.matrixCell}
                        align="center"
                      >
                        {value === 0 ? "0.0" : value.toFixed(1)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };



  const renderTabContent = (modelType) => {
    const isTraining =
      (modelType === "gnn" && trainGNN.isLoading) ||
      (modelType === "cbf" && trainCBF.isLoading) ||
      (modelType === "hybrid" && trainHybrid.isLoading);

    const isGettingRecommendations =
      (modelType === "gnn" && getGNNRecommendations.isLoading) ||
      (modelType === "cbf" && getCBFRecommendations.isLoading) ||
      (modelType === "hybrid" && getHybridRecommendations.isLoading);

    const recommendations =
      (modelType === "gnn" && getGNNRecommendations.data) ||
      (modelType === "cbf" && getCBFRecommendations.data) ||
      (modelType === "hybrid" && getHybridRecommendations.data);

    const trainingResult = trainingResults[modelType];
    const matrixData = trainingResult?.matrix_data;

    return (
      <div className={classes.tabPanel}>
        <Paper className={classes.paper}>
          {matrixData && renderMatrix(matrixData)}
          <Typography variant="h6" gutterBottom>
            Train Model Result
          </Typography>

          {trainingResult && (
            <div>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" style={{ marginBottom: 16 }}>
                {trainingResult.task_id && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleCheckStatus(modelType)}
                    disabled={checkStatus.isLoading || !trainingResult.task_id}
                  >
                    {checkStatus.isLoading ? (
                      <>
                        <CircularProgress size={16} style={{ marginRight: 8 }} />
                        Checking...
                      </>
                    ) : (
                      "Check Status"
                    )}
                  </Button>
                )}
              </Box>
              <Grid container spacing={2}>
                {trainingResult.task_id && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Task ID:
                    </Typography>
                    <Typography variant="body1" style={{ wordBreak: "break-all" }}>
                      {trainingResult.task_id}
                    </Typography>
                  </Grid>
                )}
                {trainingResult.model && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Model:
                    </Typography>
                    <Chip
                      size="small"
                      label={trainingResult.model.toUpperCase()}
                      color="primary"
                      style={{ marginTop: 4 }}
                    />
                  </Grid>
                )}
                {trainingResult.status && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status:
                    </Typography>
                    <Chip
                      size="small"
                      label={trainingResult.status.toUpperCase()}
                      style={{
                        backgroundColor: trainingResult.status === "running" ? "#ff9800" :
                          trainingResult.status === "completed" ? "#4caf50" :
                            trainingResult.status === "failed" ? "#f44336" : "#9e9e9e",
                        color: "#ffffff",
                        fontWeight: 600
                      }}
                    />
                  </Grid>
                )}
                {trainingResult.message && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Message:
                    </Typography>
                    <Chip
                      size="small"
                      label={trainingResult.message}
                      color="default"
                      style={{ marginTop: 4 }}
                    />
                  </Grid>
                )}
                {trainingResult.progress !== undefined && trainingResult.progress !== null && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Progress: {trainingResult.progress}%
                    </Typography>
                    <Box style={{ width: "100%", height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                      <Box
                        style={{
                          width: `${trainingResult.progress}%`,
                          height: "100%",
                          backgroundColor: "#4caf50",
                          transition: "width 0.3s ease"
                        }}
                      />
                    </Box>
                  </Grid>
                )}
                {(trainingResult.current_step !== undefined && trainingResult.current_step !== null) && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Current Step:
                    </Typography>
                    <Typography variant="body1">
                      {trainingResult.current_step || "N/A"}
                    </Typography>
                  </Grid>
                )}
                {(trainingResult.total_steps !== undefined && trainingResult.total_steps !== null) && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Steps:
                    </Typography>
                    <Typography variant="body1">
                      {trainingResult.total_steps || "N/A"}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </div>
          )}

          {!trainingResult && (
            <Typography variant="body2" color="textSecondary" style={{ padding: 16, textAlign: 'center' }}>
              No training result available. Click "Train Model" to start training.
            </Typography>
          )}

          <Divider style={{ margin: "24px 0" }} />

          <Typography variant="h6" gutterBottom>
            Get Recommendations
          </Typography>

          <div className={classes.formContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="User ID"
                  variant="outlined"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={classes.formField}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Product ID"
                  variant="outlined"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className={classes.formField}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Top K Personal"
                  variant="outlined"
                  type="number"
                  value={topKPersonal}
                  onChange={(e) => setTopKPersonal(parseInt(e.target.value) || 5)}
                  className={classes.formField}
                  inputProps={{ min: 1, max: 50 }}
                  helperText="Number of personal recommendations (1-50, default: 5)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Top K Outfit"
                  variant="outlined"
                  type="number"
                  value={topKOutfit}
                  onChange={(e) => setTopKOutfit(parseInt(e.target.value) || 4)}
                  className={classes.formField}
                  inputProps={{ min: 1, max: 10 }}
                  helperText="Number of outfit recommendations (1-10, default: 4)"
                />
              </Grid>
              {modelType === "hybrid" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Alpha (0-1)"
                    variant="outlined"
                    type="number"
                    value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.5)}
                    className={classes.formField}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    helperText="Blend weight between CF (GNN) and CBF (0.0-1.0)"
                  />
                </Grid>
              )}
            </Grid>

            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleGetRecommendations(modelType)}
                disabled={isGettingRecommendations || !userId || !productId}
              >
                {isGettingRecommendations ? (
                  <>
                    <CircularProgress size={20} style={{ marginRight: 8 }} />
                    Loading...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </div>
          </div>

          {recommendations && (
            <div className={classes.resultsContainer}>
              <Typography variant="h6" gutterBottom style={{ marginTop: 24 }}>
                Recommendations
              </Typography>

              {recommendations.personalized && recommendations.personalized.length > 0 && (
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Personalized Recommendations ({recommendations.personalized.length})
                  </Typography>
                  <Grid container spacing={2} style={{ marginTop: 16 }}>
                    {recommendations.personalized.map((item, index) => (
                      <Grid item xs={12} sm={4} md={4} lg={3} key={index}>
                        <div style={{ position: 'relative' }}>
                          <ProductCard
                            _id={item.product?.id}
                            id={item.product?.id}
                            productId={item.product?.id}
                            name={item.product?.productDisplayName}
                            productDisplayName={item.product?.productDisplayName}
                            images={item.product?.images}
                            price={item.product?.price || 50}
                            sale={item.product?.sale}
                            variants={item.product?.variants}
                            rating={item.product?.rating}
                            baseColour={item.product?.baseColour}
                            articleType={item.product?.articleType}
                          />
                          {/* Reason and Score overlay */}
                          <Box
                            style={{
                              marginTop: 8,
                              padding: 8,
                              backgroundColor: '#f5f5f5',
                              borderRadius: 4,
                              fontSize: '0.75rem'
                            }}
                          >
                            {getScoreChip(item.score)}
                            <ReasonList reason={item.reason} />
                          </Box>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}

              {/* Outfit Recommendations Section */}
              {recommendations.outfit && Object.keys(recommendations.outfit).length > 0 && (
                <Card className={classes.recommendationCard}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Outfit Recommendations
                    </Typography>
                    {recommendations.outfit_complete_score !== undefined && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Outfit Complete Score: {recommendations.outfit_complete_score.toFixed(4)}
                      </Typography>
                    )}

                    <TableContainer component={Paper} style={{ marginTop: 16 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Outfit</strong></TableCell>
                            <TableCell><strong>Accessories</strong></TableCell>
                            <TableCell><strong>Top Wear</strong></TableCell>
                            <TableCell><strong>Bottom Wear</strong></TableCell>
                            <TableCell><strong>Footwear</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(recommendations.outfit).map(([outfitName, outfitItems]) => (
                            <TableRow key={outfitName}>
                              <TableCell>
                                <Typography variant="subtitle2" style={{ textTransform: 'capitalize' }}>
                                  {outfitName.replace('_', ' ')}
                                </Typography>
                              </TableCell>

                              {/* Accessories */}
                              <TableCell>
                                {outfitItems.accessories && (
                                  <Box>
                                    <img
                                      src={outfitItems.accessories.product?.images?.[0] || '/placeholder-image.jpg'}
                                      alt={outfitItems.accessories.product?.productDisplayName}
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                                    />
                                    <Typography variant="caption" display="block" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                                      {outfitItems.accessories.product?.productDisplayName}
                                    </Typography>
                                    <Box style={{ marginTop: 4 }}>
                                      {getScoreChip(outfitItems.accessories.score)}
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
                                      {outfitItems.accessories.product?.baseColour} | {outfitItems.accessories.product?.articleType}
                                    </Typography>
                                    <ReasonList reason={outfitItems.accessories.reason} />
                                  </Box>
                                )}
                              </TableCell>

                              {/* Top Wear */}
                              <TableCell>
                                {outfitItems.apparel_topwear && (
                                  <Box>
                                    <img
                                      src={outfitItems.apparel_topwear.product?.images?.[0] || '/placeholder-image.jpg'}
                                      alt={outfitItems.apparel_topwear.product?.productDisplayName}
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                                    />
                                    <Typography variant="caption" display="block" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                                      {outfitItems.apparel_topwear.product?.productDisplayName}
                                    </Typography>
                                    <Box style={{ marginTop: 4 }}>
                                      {getScoreChip(outfitItems.apparel_topwear.score)}
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
                                      {outfitItems.apparel_topwear.product?.baseColour} | {outfitItems.apparel_topwear.product?.articleType}
                                    </Typography>
                                    <ReasonList reason={outfitItems.apparel_topwear.reason} />
                                  </Box>
                                )}
                              </TableCell>

                              {/* Bottom Wear */}
                              <TableCell>
                                {outfitItems.apparel_bottomwear && (
                                  <Box>
                                    <img
                                      src={outfitItems.apparel_bottomwear.product?.images?.[0] || '/placeholder-image.jpg'}
                                      alt={outfitItems.apparel_bottomwear.product?.productDisplayName}
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                                    />
                                    <Typography variant="caption" display="block" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                                      {outfitItems.apparel_bottomwear.product?.productDisplayName}
                                    </Typography>
                                    <Box style={{ marginTop: 4 }}>
                                      {getScoreChip(outfitItems.apparel_bottomwear.score)}
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
                                      {outfitItems.apparel_bottomwear.product?.baseColour} | {outfitItems.apparel_bottomwear.product?.articleType}
                                    </Typography>
                                    <ReasonList reason={outfitItems.apparel_bottomwear.reason} />
                                  </Box>
                                )}
                              </TableCell>

                              {/* Footwear */}
                              <TableCell>
                                {outfitItems.footwear && (
                                  <Box>
                                    <img
                                      src={outfitItems.footwear.product?.images?.[0] || '/placeholder-image.jpg'}
                                      alt={outfitItems.footwear.product?.productDisplayName}
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                                    />
                                    <Typography variant="caption" display="block" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                                      {outfitItems.footwear.product?.productDisplayName}
                                    </Typography>
                                    <Box style={{ marginTop: 4 }}>
                                      {getScoreChip(outfitItems.footwear.score)}
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
                                      {outfitItems.footwear.product?.baseColour} | {outfitItems.footwear.product?.articleType}
                                    </Typography>
                                    <ReasonList reason={outfitItems.footwear.reason} />
                                  </Box>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}

              {(!recommendations.personalized || recommendations.personalized.length === 0) &&
                (!recommendations.outfit || Object.keys(recommendations.outfit).length === 0) && (
                  <Typography variant="body2" color="textSecondary" style={{ padding: 16, textAlign: 'center' }}>
                    No recommendations available
                  </Typography>
                )}
            </div>
          )}
        </Paper>
      </div>
    );
  };

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Recommend Products" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginBottom: 24 }}
            >
              <Link color="inherit" component={RouterLink} to="/admin/products">
                Dashboard
              </Link>
              <Typography color="textPrimary">Recommend Products</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="GNN Model" />
                <Tab label="CBF Model" />
                <Tab label="Hybrid Model" />
              </Tabs>
              <Box>
                {(() => {
                  const currentModelType = getCurrentModelType();
                  const isTraining =
                    (currentModelType === "gnn" && trainGNN.isLoading) ||
                    (currentModelType === "cbf" && trainCBF.isLoading) ||
                    (currentModelType === "hybrid" && trainHybrid.isLoading);
                  return (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleTrain(currentModelType)}
                      disabled={isTraining}
                      style={{ marginRight: 16 }}
                    >
                      {isTraining ? (
                        <>
                          <CircularProgress size={20} style={{ marginRight: 8 }} />
                          Training...
                        </>
                      ) : (
                        "Train Model"
                      )}
                    </Button>
                  );
                })()}
              </Box>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {renderTabContent("gnn")}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderTabContent("cbf")}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {renderTabContent("hybrid")}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecommendProductsScreen;

