import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent, Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
	TrendingUp,
	TrendingDown,
	People,
	ShoppingCart,
	AttachMoney,
	Store,
	ArrowUpward,
	ArrowDownward,
	Assessment,
} from '@material-ui/icons';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import {
	useGetOverviewStats,
	useGetRevenueChart,
	useGetTopProducts,
	useGetUserDemographics,
	useGetOrderStatus,
	useGetRecentOrders,
	useGetProductCategories,
	useGetSalesByGender,
} from '../../hooks/api/useAdminStats';
import Meta from '../../components/Meta';
import Message from '../../components/Message';

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: 0,
		marginBottom: theme.spacing(10),
		maxWidth: '100%',
		padding: 0,
	},
	pageTitle: {
		marginBottom: theme.spacing(4),
		fontWeight: 600,
		fontSize: '1.75rem',
		background: 'linear-gradient(135deg, #DD8190 0%, #B8606E 100%)',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing(1.5),
	},
	statsCard: {
		height: '100%',
		position: 'relative',
		overflow: 'hidden',
		background: 'linear-gradient(180deg, rgba(245, 0, 87, 0.05) 0%, #ffffff 100%)',
		border: '1.5px solid rgba(245, 0, 87, 0.15)',
		color: '#1a202c',
		borderRadius: 16,
		boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
		transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
		'&::before': {
			content: '""',
			position: 'absolute',
			top: -20,
			right: -20,
			width: 120,
			height: 120,
			borderRadius: '50%',
			background: 'rgba(245, 0, 87, 0.03)',
			transition: 'all 0.6s ease',
		},
		'&::after': {
			content: '""',
			position: 'absolute',
			bottom: -30,
			left: -20,
			width: 100,
			height: 100,
			borderRadius: '50%',
			background: 'rgba(245, 0, 87, 0.03)',
			transition: 'all 0.6s ease',
		},
		'&:hover': {
			transform: 'translateY(-5px)',
			borderColor: '#F50057',
			boxShadow: '0 15px 30px -5px rgba(245, 0, 87, 0.12)',
			'&::before': {
				transform: 'scale(1.5) translate(-10%, 10%)',
				background: 'rgba(245, 0, 87, 0.06)',
			},
			'&::after': {
				transform: 'scale(1.3) translate(10%, -10%)',
				background: 'rgba(245, 0, 87, 0.05)',
			},
			'& $iconWrapper': {
				background: '#F50057',
				boxShadow: '0 4px 12px rgba(245, 0, 87, 0.3)',
				'& svg': {
					color: '#ffffff',
					transform: 'scale(1.1)',
				},
			},
		},
	},
	iconWrapper: {
		width: 48,
		height: 48,
		borderRadius: 12,
		background: 'rgba(245, 0, 87, 0.08)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: theme.spacing(2),
		position: 'relative',
		zIndex: 2,
		transition: 'all 0.3s ease',
		'& svg': {
			color: '#F50057',
			fontSize: 24,
			transition: 'all 0.3s ease',
		},
	},
	statValue: {
		fontSize: '2rem',
		fontWeight: 700,
		letterSpacing: '-0.02em',
		position: 'relative',
		zIndex: 2,
	},
	statLabel: {
		fontSize: '0.8125rem',
		opacity: 0.6,
		textTransform: 'uppercase',
		letterSpacing: '0.05em',
		fontWeight: 600,
		position: 'relative',
		zIndex: 2,
	},
	growthBadge: {
		marginTop: theme.spacing(1),
		padding: '4px 12px',
		borderRadius: 12,
		background: 'currentColor',
		opacity: 0.15,
		display: 'inline-flex',
		alignItems: 'center',
		gap: 4,
		fontSize: '0.75rem',
		fontWeight: 600,
	},
	chartPaper: {
		padding: theme.spacing(2),
		borderRadius: 12,
		boxShadow: 'none',
		height: '100%',
		border: '2px solid #eee',
		background: '#ffffff',
	},
	chartHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: theme.spacing(1),
		marginBottom: theme.spacing(2),
		borderBottom: '1px solid #e2e8f0',
	},
	chartTitle: {
		fontWeight: 600,
		color: '#2d3748',
		marginBottom: 0,
	},
	periodSelector: {
		minWidth: 120,
	},
	tableContainer: {
		maxHeight: 400,
		overflowY: 'auto',
	},
	orderRow: {
		padding: theme.spacing(2),
		borderBottom: '1px solid #e2e8f0',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		transition: 'background 0.2s',
		'&:hover': {
			background: '#f7fafc',
		},
	},
	statusBadge: {
		padding: '4px 12px',
		borderRadius: 12,
		fontSize: '0.75rem',
		fontWeight: 600,
	},
	loadingContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 400,
	},
}));

const COLORS = ['#DD8190', '#DB2777', '#F50057', '#B8606E', '#FFB7C5', '#FF4D6D', '#C9184A', '#A4133C'];

const StatisticsScreen = () => {
	const classes = useStyles();
	const [revenuePeriod, setRevenuePeriod] = useState('30d');
	const [topProductsSort, setTopProductsSort] = useState('revenue');
	const [topProductsLimit, setTopProductsLimit] = useState(10);

	// Fetch all data using hooks
	const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useGetOverviewStats();
	const { data: revenueData, isLoading: revenueLoading } = useGetRevenueChart({ period: revenuePeriod });
	const { data: topProductsData, isLoading: topProductsLoading } = useGetTopProducts({ 
		sort_by: topProductsSort, 
		limit: topProductsLimit 
	});
	const { data: demographicsData, isLoading: demographicsLoading } = useGetUserDemographics();
	const { data: orderStatusData, isLoading: orderStatusLoading } = useGetOrderStatus();
	const { data: recentOrdersData, isLoading: recentOrdersLoading } = useGetRecentOrders({ limit: 10 });
	const { data: categoriesData, isLoading: categoriesLoading } = useGetProductCategories();
	const { data: salesByGenderData, isLoading: salesByGenderLoading } = useGetSalesByGender();

	const overview = overviewData?.data;
	const isLoading = overviewLoading || revenueLoading;

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value);
	};

	const formatNumber = (value) => {
		return new Intl.NumberFormat('en-US').format(value);
	};

	const renderStatsCards = () => {
		if (!overview) return null;

		const stats = [
			{
				label: 'Total Users',
				value: formatNumber(overview.totals.users),
				icon: <People style={{ fontSize: 32 }} />,
				growth: overview.growth.users_percent,
				thisMonth: overview.this_month.new_users,
			},
			{
				label: 'Total Products',
				value: formatNumber(overview.totals.products),
				icon: <Store style={{ fontSize: 32 }} />,
				growth: 0,
				thisMonth: null,
			},
			{
				label: 'Total Orders',
				value: formatNumber(overview.totals.orders),
				icon: <ShoppingCart style={{ fontSize: 32 }} />,
				growth: overview.growth.orders_percent,
				thisMonth: overview.this_month.orders,
			},
			{
				label: 'Total Revenue',
				value: formatCurrency(overview.totals.revenue),
				icon: <AttachMoney style={{ fontSize: 32 }} />,
				growth: overview.growth.revenue_percent,
				thisMonth: formatCurrency(overview.this_month.revenue),
			},
		];

		return (
			<Grid container spacing={3}>
				{stats.map((stat, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Card className={classes.statsCard}>
							<CardContent>
								<Box className={classes.iconWrapper}>
									{stat.icon}
								</Box>
								<Typography className={classes.statValue}>
									{stat.value}
								</Typography>
								<Typography className={classes.statLabel}>
									{stat.label}
								</Typography>
								{stat.thisMonth !== null && (
									<Typography variant="body2" style={{ marginTop: 8, opacity: 0.9 }}>
										This month: {typeof stat.thisMonth === 'number' ? formatNumber(stat.thisMonth) : stat.thisMonth}
									</Typography>
								)}
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		);
	};

	// Render Revenue Chart
	const renderRevenueChart = () => {
		if (!revenueData?.data) return null;

		const chartData = revenueData.data.labels.map((label, index) => ({
			date: label,
			revenue: revenueData.data.datasets[0].data[index],
			orders: revenueData.data.datasets[1].data[index],
		}));

		return (
			<Paper className={classes.chartPaper}>
				<Box className={classes.chartHeader}>
					<Typography variant="h6" className={classes.chartTitle}>
						Revenue & Orders Trend
					</Typography>
					<FormControl className={classes.periodSelector}>
						<Select
							value={revenuePeriod}
							onChange={(e) => setRevenuePeriod(e.target.value)}
							variant="outlined"
							size="small"
						>
							<MenuItem value="7d">Last 7 Days</MenuItem>
							<MenuItem value="30d">Last 30 Days</MenuItem>
							<MenuItem value="90d">Last 90 Days</MenuItem>
							<MenuItem value="1y">Last Year</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<ResponsiveContainer width="100%" height={350}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
						<XAxis dataKey="date" stroke="#718096" />
						<YAxis yAxisId="left" stroke="#DD8190" />
						<YAxis yAxisId="right" orientation="right" stroke="#DB2777" />
						<Tooltip 
							contentStyle={{ 
								background: 'white', 
								border: 'none', 
								borderRadius: 8, 
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
							}}
							formatter={(value, name) => {
								if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
								return [formatNumber(value), 'Orders'];
							}}
						/>
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="revenue"
							stroke="#DD8190"
							strokeWidth={3}
							dot={{ fill: '#DD8190', r: 4 }}
							activeDot={{ r: 6 }}
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="orders"
							stroke="#DB2777"
							strokeWidth={3}
							dot={{ fill: '#DB2777', r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Paper>
		);
	};

	// Render Top Products
	const renderTopProducts = () => {
		if (!topProductsData?.data) return null;

		const products = topProductsData.data.products;

		return (
			<Paper className={classes.chartPaper}>
				<Box className={classes.chartHeader}>
					<Typography variant="h6" className={classes.chartTitle}>
						Top Products
					</Typography>
					<Box display="flex" gap={1}>
						<FormControl size="small" style={{ minWidth: 120 }}>
							<Select
								value={topProductsSort}
								onChange={(e) => setTopProductsSort(e.target.value)}
								variant="outlined"
							>
								<MenuItem value="revenue">By Revenue</MenuItem>
								<MenuItem value="quantity">By Quantity</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Box>
				<ResponsiveContainer width="100%" height={350}>
					<BarChart data={products} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
						<XAxis type="number" stroke="#718096" />
						<YAxis 
							dataKey="name" 
							type="category" 
							width={200} 
							stroke="#718096"
							tick={{ fontSize: 12 }}
						/>
						<Tooltip 
							contentStyle={{ 
								background: 'white', 
								border: 'none', 
								borderRadius: 8, 
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
							}}
							formatter={(value, name) => {
								if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
								return [formatNumber(value), 'Quantity'];
							}}
						/>
						<Bar 
							dataKey={topProductsSort === 'revenue' ? 'revenue' : 'quantity'} 
							fill="#DD8190"
							radius={[0, 8, 8, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Paper>
		);
	};

	// Render User Demographics
	const renderUserDemographics = () => {
		if (!demographicsData?.data) return null;

		const genderData = demographicsData.data.gender.labels.map((label, index) => ({
			name: label,
			value: demographicsData.data.gender.data[index],
		}));

		const ageData = demographicsData.data.age_groups.labels.map((label, index) => ({
			name: label,
			value: demographicsData.data.age_groups.data[index],
		}));

		return (
			<>
				<Grid item xs={12} md={4}>
					<Paper className={classes.chartPaper}>
						<Box className={classes.chartHeader}>
							<Typography variant="h6" className={classes.chartTitle}>
								Users by Gender
							</Typography>
						</Box>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={genderData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									{genderData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper className={classes.chartPaper}>
						<Box className={classes.chartHeader}>
							<Typography variant="h6" className={classes.chartTitle}>
								Users by Age Group
							</Typography>
						</Box>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={ageData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
								<XAxis dataKey="name" stroke="#718096" />
								<YAxis stroke="#718096" />
								<Tooltip 
									contentStyle={{ 
										background: 'white', 
										border: 'none', 
										borderRadius: 8, 
										boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
									}}
								/>
								<Bar dataKey="value" fill="#DB2777" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</>
		);
	};

	// Render Order Status
	const renderOrderStatus = () => {
		if (!orderStatusData?.data) return null;

		const paymentData = orderStatusData.data.payment_status.labels.map((label, index) => ({
			name: label,
			value: orderStatusData.data.payment_status.data[index],
		}));

		const fulfillmentData = orderStatusData.data.fulfillment_status.labels.map((label, index) => ({
			name: label,
			value: orderStatusData.data.fulfillment_status.data[index],
		}));

		return (
			<>
				<Grid item xs={12} md={4}>
					<Paper className={classes.chartPaper}>
						<Box className={classes.chartHeader}>
							<Typography variant="h6" className={classes.chartTitle}>
								Payment Status
							</Typography>
						</Box>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={paymentData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									fill="#8884d8"
									paddingAngle={5}
									dataKey="value"
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
								>
									{paymentData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper className={classes.chartPaper}>
						<Box className={classes.chartHeader}>
							<Typography variant="h6" className={classes.chartTitle}>
								Fulfillment Status
							</Typography>
						</Box>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={fulfillmentData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									fill="#8884d8"
									paddingAngle={5}
									dataKey="value"
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
								>
									{fulfillmentData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</>
		);
	};

	// Render Recent Orders
	const renderRecentOrders = () => {
		if (!recentOrdersData?.data) return null;

		const orders = recentOrdersData.data.orders;

		return (
			<Paper className={classes.chartPaper}>
				<Box className={classes.chartHeader}>
					<Typography variant="h6" className={classes.chartTitle}>
						Recent Orders
					</Typography>
				</Box>
				<Box className={classes.tableContainer}>
					{orders.map((order) => (
						<Box key={order.id} className={classes.orderRow}>
							<Box>
								<Typography variant="body2" style={{ fontWeight: 600 }}>
									#{order.id.slice(-8)}
								</Typography>
								<Typography variant="caption" color="textSecondary">
									{new Date(order.created_at).toLocaleDateString('en-US')}
								</Typography>
							</Box>
							<Box>
								<Typography variant="body2" style={{ fontWeight: 600 }}>
									{formatCurrency(order.total_price)}
								</Typography>
							</Box>
							<Box display="flex" gap={1}>
								<Chip
									label={order.is_paid ? 'Paid' : 'Unpaid'}
									size="small"
									style={{
										background: order.is_paid ? '#43e97b' : '#f5576c',
										color: 'white',
										fontWeight: 600,
									}}
								/>
								<Chip
									label={order.is_delivered ? 'Delivered' : 'Processing'}
									size="small"
									style={{
										background: order.is_delivered ? '#4facfe' : '#ffa726',
										color: 'white',
										fontWeight: 600,
									}}
								/>
							</Box>
						</Box>
					))}
				</Box>
			</Paper>
		);
	};

	// Render Product Categories & Sales by Gender
	const renderAdditionalCharts = () => {
		if (!categoriesData?.data || !salesByGenderData?.data) return null;

		const categoryData = categoriesData.data.labels.map((label, index) => ({
			name: label,
			value: categoriesData.data.data[index],
		}));

		const salesData = salesByGenderData.data.labels.map((label, index) => ({
			name: label,
			value: salesByGenderData.data.data[index],
		}));

		return (
			<>
				<Grid item xs={12} md={4}>
					<Paper className={classes.chartPaper}>
						<Box className={classes.chartHeader}>
							<Typography variant="h6" className={classes.chartTitle}>
								Product Categories
							</Typography>
						</Box>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={categoryData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									{categoryData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper className={classes.chartPaper}>
						<Box className={classes.chartHeader}>
							<Typography variant="h6" className={classes.chartTitle}>
								Sales by Gender
							</Typography>
						</Box>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={salesData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
								<XAxis dataKey="name" stroke="#718096" />
								<YAxis stroke="#718096" />
								<Tooltip 
									contentStyle={{ 
										background: 'white', 
										border: 'none', 
										borderRadius: 8, 
										boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
									}}
									formatter={(value) => formatCurrency(value)}
								/>
								<Bar dataKey="value" radius={[8, 8, 0, 0]}>
									{salesData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</>
		);
	};

	if (overviewError) {
		return (
			<Container className={classes.container} disableGutters>
				<Message severity="error">
					Error loading statistics: {overviewError.message}
				</Message>
			</Container>
		);
	}

	if (isLoading) {
		return (
			<Container className={classes.container} disableGutters>
				<Box className={classes.loadingContainer}>
					<CircularProgress size={60} />
				</Box>
			</Container>
		);
	}

	return (
		<Container className={classes.container} disableGutters>
			<Meta title="Admin Statistics | Dashboard" />
			{/* Overview Stats Cards */}
			<Box mb={2}>
				{renderStatsCards()}
			</Box>

			{/* Revenue Chart */}
			<Box mb={2}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						{renderRevenueChart()}
					</Grid>
				</Grid>
			</Box>

			{/* Top Products & Recent Orders */}
			<Box mb={2}>
				<Grid container spacing={3}>
					<Grid item xs={12} lg={6}>
						{renderTopProducts()}
					</Grid>
					<Grid item xs={12} lg={6}>
						{renderRecentOrders()}
					</Grid>
				</Grid>
			</Box>

			{/* User Demographics, Order Status & Product Categories */}
			<Box mb={2}>
				<Grid container spacing={3}>
					{renderUserDemographics()}
					{renderOrderStatus()}
					{renderAdditionalCharts()}
				</Grid>
			</Box>
		</Container>
	);
};

export default StatisticsScreen;