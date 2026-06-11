import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { HOME } from '../constants/routes';
import { IMAGE_SRC } from '../constants/variables';
import { PAGE_NOT_FOUND_TITLE, APP_NAME } from '../constants/strings';

function PageNotFound() {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = PAGE_NOT_FOUND_TITLE;

    timerRef.current = setTimeout(() => {
      setRedirectToHome(true);
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (redirectToHome) {
    return <Navigate to={HOME} replace />;
  }

  return (
    <section className="page-not-found">
      <div className="page-not-found__container">
        <img className="page-not-found__image" src={IMAGE_SRC.COW_PIC} alt="cow-img" />
        <div className="page-not-found__title">Page Not Found</div>
        <div className="page-not-found__content">
          <p>This is not the web page you are looking for.</p>
          <p>You will be redirected to the {APP_NAME} home page within 10 seconds.</p>
        </div>
        <div className="page-not-found__link">
          <Link to={HOME}>Go to home</Link>
        </div>
      </div>
    </section>
  );
}

export default PageNotFound;
