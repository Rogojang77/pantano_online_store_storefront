import { CheckoutLayoutClient } from './checkout-layout-client';

export const dynamic = 'force-dynamic';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <CheckoutLayoutClient>{children}</CheckoutLayoutClient>;
}
