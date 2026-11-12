import React from 'react';

function PageHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="page-heading">
      <div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

export default PageHeading;
