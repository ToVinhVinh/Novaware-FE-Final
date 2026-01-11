import Alert from '@material-ui/lab/Alert';

const Message = ({ severity = 'error', children, mt = 16, mb = 16, ml, mr, m }) => {
  const renderContent = () => {
    if (children === null || children === undefined) {
      return 'An error occurred';
    }
    
    if (children instanceof Error) {
      return children.message || String(children);
    }
    
    if (typeof children === 'object') {
      if (children.response?.data?.message) {
        return children.response.data.message;
      }
      if (children.message) {
        return children.message;
      }
      if (children.error) {
        return typeof children.error === 'string' ? children.error : String(children.error);
      }
      return String(children);
    }
    
    return children;
  };

  return (
    <Alert
      style={{
        margin: m ? m : 0,
        marginTop: mt,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,
        width: '100%',
      }}
      severity={severity}
    >
      {renderContent()}
    </Alert>
  );
};

export default Message;
