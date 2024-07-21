import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Button from '../common/Button';
import { Order } from '@/app/types/order';
import { formatToBRDate } from '@/common/datetime';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_signatureData: string) => void;
  orderEmailTarget: Order | undefined
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave, orderEmailTarget }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (signatureData) {
      onSave(signatureData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 overflow-auto">
      <div className="bg-white dark:bg-black p-4 rounded-lg shadow-lg max-w-xl w-full ">
        <h2 className="text-xl mb-4 text-center text-purple-900 font-bold ">Resumo de Serviço</h2>

        {orderEmailTarget && (
          <div className="mb-4 flex-col">
            <div className='flex'>
              <p><strong>Data/Hora de Início:</strong> {formatToBRDate(orderEmailTarget.startWorkDateTime)}</p>
              <p><strong>Data/Hora de Término:</strong> {formatToBRDate(orderEmailTarget.endWorkDateTime)}</p>
            </div>
            <p className='mt-4'><strong>Descrição do serviço:</strong> <br /> {orderEmailTarget.description}</p>
            <p className='mt-4'><strong>Valor do serviço:</strong> <br/> R$ {orderEmailTarget.price.toFixed(2)}</p>
            <p className='mt-4'><strong>Peças com necessidade de manutenção:</strong>
              <ol>
                {orderEmailTarget.parts?.map((part, index) => (
                  <li key={index}>{index + 1}- {part}</li>
                ))}
              </ol>
            </p>
            <hr className='mt-6' />
            <p>Após revisar todas as informações acima, por favor, assine abaixo:</p>
          </div>
        )}

        <SignatureCanvas
          ref={sigCanvas}
          penColor="purple"
          canvasProps={{ className: 'signatureCanvas w-full h-48 border border-gray-300' }}
        />
        <div className="mt-4 flex justify-center">
          <Button text='Limpar' type={"WARNING"} onClick={clear} />
          <Button text='Enviar' type={"CONFIRM"} onClick={save} specialClass='ml-2' />
          <Button text='Cancelar' type={"CANCEL"} onClick={onClose} specialClass='ml-2' />
        </div>
      </div>
    </div>

  );
};

export default SignatureModal;
