const LoadingBar = ({ any }) => {
  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    margin: 5,
  };

  const fillerStyles = {
    height: '100%',
    width: `${value}%`,
    backgroundColor: '#007bff',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 0.5s ease-in-out',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}></div>
    </div>
  );
};

export default LoadingBar;