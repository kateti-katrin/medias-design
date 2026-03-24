// services_app.jsx — React component for interactive services section
import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function ServiceCard({ title, body, onOpen }) {
  return (
    <div className="react-service-card">
      <p className="react-service-card__title">{title}</p>
      <p className="react-service-card__body">{body}</p>
      <button
        className="btn btn--primary react-service-card__btn"
        onClick={onOpen}
      >
        Открыть
      </button>
    </div>
  );
}

function ServiceModal({ title, onClose }) {
  return (
    <div className="react-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="react-modal__overlay" onClick={onClose} />
      <div className="react-modal__content">
        <button className="react-modal__close" onClick={onClose} aria-label="Закрыть">✕</button>
        <h2 className="react-modal__title">{title}</h2>
        <p className="react-modal__body">
          Функциональность сервиса будет доступна в следующей версии.
        </p>
      </div>
    </div>
  );
}

function ServicesApp({ service1Title, service1Body, service2Title, service2Body }) {
  const [activeService, setActiveService] = useState(null);

  return (
    <>
      {activeService && (
        <ServiceModal
          title={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}

export function mountServicesApp(el) {
  const props = {
    service1Title: el.dataset.service1Title,
    service1Body:  el.dataset.service1Body,
    service2Title: el.dataset.service2Title,
    service2Body:  el.dataset.service2Body,
  };
  const root = createRoot(el);
  root.render(<ServicesApp {...props} />);
}
