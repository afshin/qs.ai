import s from './LoadingDots.module.css';
import cn from 'classnames';

const LoadingDots = (props: { className?: string }) => {
  const rootClassName = cn(s.root, props.className);
  return (
    <span className={rootClassName}>
      <span />
      <span />
      <span />
    </span>
  );
};

export default LoadingDots;
