import React, { useState } from 'react';
import Modal from '../organisms/Modal';
import Button from '../atoms/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

/**
 * OveragesModal – a reusable modal that allows the user to select an
 * additional quota (overage) for a given resource.
 *
 * The component receives a callback `onConfirm` which receives the selected
 * overage value. It can be used anywhere in the app where resource limits are
 * managed.
 */
const OveragesModal = ({ isOpen, onClose, onConfirm }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selected, setSelected] = useState('');
  const options = [
    { label: t('auto.increase_by_10'), value: '10' },
    { label: t('auto.increase_by_25'), value: '25' },
    { label: t('auto.increase_by_50'), value: '50' },
    { label: t('auto.custom_increase'), value: 'custom' },
  ];

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('auto.increase_overage')}
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="secondary" onClick={onClose} tooltip={t('auto.cancel')}>
            {t('auto.cancel')}
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!selected} tooltip={t('auto.confirm')}>
            <FontAwesomeIcon icon={faCheck} className="mr-2 rtl:ml-2" />
            {t('auto.confirm')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="overage"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="accent-theme-primary"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
        {selected === 'custom' && (
          <input
            type="number"
            placeholder={t('auto.enter_custom')}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
            onChange={(e) => setSelected(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
};

export default OveragesModal;
