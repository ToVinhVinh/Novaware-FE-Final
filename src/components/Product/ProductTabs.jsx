import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetLatestProducts, useGetSaleProducts, useGetProducts } from '../../hooks/api/useProduct';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ProductCard from './ProductCard';
import { Button, Typography } from '@material-ui/core';
import LottieLoading from '../LottieLoading';
import LottieEmpty from '../LottieEmpty';
import Loader from '../Loader';
import StorefrontIcon from "@material-ui/icons/Storefront";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3} px={0} component='div'>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    wrapped: true,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow: 'none',
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
    },
  },
  tab: {
    textTransform: 'capitalize',
    fontSize: '1rem',
    '@media (max-width: 400px)': {
      fontSize: '12px',
    },
  },
  buttonMore: {
    marginTop: 30,
    ...theme.mixins.customize.centerFlex(),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
}));

const ProductTabs = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const titles = ['Latest Products', 'Sale Products', 'All Products'];

  const { data: productLatestResponse, isLoading: loadingProductLatest, error: errorProductLatest } = useGetLatestProducts({ pageNumber: 1, perPage: 10 });
  const productsLatestRaw = productLatestResponse?.data?.products || [];
  const productsLatest = useMemo(() => productsLatestRaw.slice(0, 15).sort(() => 0.5 - Math.random()), [productsLatestRaw]);
  const { data: productSaleResponse, isLoading: loadingProductSale, error: errorProductSale } = useGetSaleProducts({ pageNumber: 1, perPage: 10 });
  const productsSaleRaw = productSaleResponse?.data?.products || [];
  const productsSale = useMemo(() => productsSaleRaw.slice(0, 15).sort(() => 0.5 - Math.random()), [productsSaleRaw]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="mx-auto px-12">
      <div className='w-full flex items-center justify-center gap-4 my-10'>
        <div className='h-[1px] bg-primary flex-1'></div>
        <Typography variant="h5" align="center" className="tracking-widest">{titles[value] || ''}</Typography>
        <div className='h-[1px] bg-primary flex-1'></div>
      </div>
      <AppBar position='static' className={classes.appBar}>
        <Tabs
          variant={matches ? 'scrollable' : 'standard'}
          value={value}
          onChange={handleChange}
          aria-label='tabs product'
          indicatorColor='secondary'
          textColor='secondary'
          className={classes.tabs}
        >
          <Tab
            className={classes.tab}
            label='Latest Arrivals'
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tab}
            label='Sale Products'
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {loadingProductLatest ? (
          <Loader />
        ) : errorProductLatest ? (
          <LottieEmpty className="flex justify-center" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-4 mb-6">
            {productsLatest &&
              productsLatest.map((product, index) => {
                const key =
                  product?._id ??
                  product?.id ??
                  product?.slug ??
                  `latest-${product?.name ?? 'product'}-${product?.sku ?? index}`;
                return (
                  <div key={key}>
                    <ProductCard {...product} />
                  </div>
                );
              })}
          </div>
        )}
        <div className={classes.buttonMore}>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to='/shop?sort_by=latest'
            className="!rounded-full"
          >
           <span className="mr-2">View more</span>
            <StorefrontIcon fontSize="small" className="text-white" />
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {loadingProductSale ? (
          <LottieLoading className="flex justify-center" />
        ) : errorProductSale ? (
          <LottieEmpty className="flex justify-center" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {productsSale &&
              productsSale.map((product, index) => {
                const key =
                  product?._id ?? product?.id ?? product?.slug ?? `sale-${product?.name ?? 'product'}-${index}`;
                return (
                  <div key={key}>
                    <ProductCard {...product} />
                  </div>
                );
              })}
          </div>
        )}
        <div className={classes.buttonMore}>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to='/shop?sort_by=sale'
            className="!rounded-full"
          >
            <span className="mr-2">View more</span>
            <StorefrontIcon fontSize="small" className="text-white" />
          </Button>
        </div>
      </TabPanel>
    </div>
  );
};

export default ProductTabs;
