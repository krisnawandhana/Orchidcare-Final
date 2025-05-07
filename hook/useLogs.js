import { useDispatch, useSelector } from 'react-redux';
import { setLogs } from '../app/features/homepageSlice';

const useLogs = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.homepage.logs);

  const clearLogs = () => {
    dispatch(setLogs([]));
  };

  return { logs, clearLogs };
};

export default useLogs;
