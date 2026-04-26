'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface AddToCartStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  /** Stoc total pentru variantă */
  stockQuantity: number;
  /** Bucăți deja în coș */
  quantityInCart: number;
  /** Cantitatea maximă pe care o poți adăuga acum (stoc rămas) */
  maxAddable: number;
  /** Cantitatea aleasă de client (poate depăși maxAddable) */
  selectedQuantity: number;
  /** Adaugă cantitatea efectivă (de obicei maxAddable) */
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

export function AddToCartStockDialog({
  open,
  onOpenChange,
  productName,
  stockQuantity,
  quantityInCart,
  maxAddable,
  selectedQuantity,
  onConfirm,
  confirmDisabled = false,
}: AddToCartStockDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[100] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-200 bg-white p-5 shadow-lg focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
              aria-hidden
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="pr-8 font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                Cantitatea depășește stocul disponibil
              </Dialog.Title>
              <Dialog.Description asChild>
                <div className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {productName}
                    </span>
                  </p>
                  <p>
                    Ai selectat{' '}
                    <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">
                      {selectedQuantity}{' '}
                      {selectedQuantity === 1 ? 'bucată' : 'bucăți'}
                    </span>
                    , dar stocul disponibil este{' '}
                    <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">
                      {stockQuantity}{' '}
                      {stockQuantity === 1 ? 'bucată' : 'bucăți'}
                    </span>
                    {quantityInCart > 0 && (
                      <>
                        {' '}
                        (ai deja{' '}
                        <span className="tabular-nums">{quantityInCart}</span>{' '}
                        {quantityInCart === 1 ? 'bucată' : 'bucăți'} în coș)
                      </>
                    )}
                    .
                  </p>
                  <p>
                    Poți adăuga acum cel mult{' '}
                    <span className="font-semibold tabular-nums text-primary-600 dark:text-primary-400">
                      {maxAddable} {maxAddable === 1 ? 'bucată' : 'bucăți'}
                    </span>
                    .
                  </p>
                </div>
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="absolute right-3 top-3 rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Închide"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Anulează
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={confirmDisabled || maxAddable < 1}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Adaugă {maxAddable}{' '}
              {maxAddable === 1 ? 'bucată' : 'bucăți'} în coș
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
