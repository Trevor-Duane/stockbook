const formatCurrencyShs = (amount) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  export default formatCurrencyShs;
  