import { useContext, useEffect, useState } from "react";
import LoadingModel from "../components/LoadingModel/LoadingModel";
import { AppContext } from "../context/AppContext";

const useLoading = () => {
  const [visible, setVisible] = useState(false);

  const { showLoading, setShowLoading } = useContext(AppContext);

  function open() {
    setShowLoading(true);
    setVisible(true);
  }
  function close() {
    setTimeout(() => {
      setShowLoading(false);
      setVisible(false);
    }, 500);
  }
  const modal = <LoadingModel show={visible} />;

  return { open, close, visible, modal };
};

export default useLoading;
