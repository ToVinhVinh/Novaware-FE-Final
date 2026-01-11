import { Helmet } from 'react-helmet';

const Meta = ({
  title = 'NovaWare',
  description = 'Wear What You Love. Love What You Wear.',
  keywords = 'Limited Edition, Only While Supplies Last, Exclusive Offer'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

export default Meta;
