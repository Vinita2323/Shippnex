import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PageSkeleton from '../../../components/PageSkeleton';
import { membershipService } from '../../../services/authService';

/**
 * Keeps sellers without an active membership on /seller/membership.
 * Backend still enforces product/order eligibility; this is a panel UX gate.
 */
const SellerMembershipGate = () => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [needsMembership, setNeedsMembership] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setChecking(true);
      try {
        const res = await membershipService.getSellerMembership();
        const mem = res?.membership;
        const active =
          mem &&
          mem.membershipStatus === 'active' &&
          mem.expiryDate &&
          new Date(mem.expiryDate) > new Date();

        if (!cancelled) {
          setNeedsMembership(!active);
          if (active) {
            localStorage.removeItem('shippnex_seller_requires_membership');
          } else {
            localStorage.setItem('shippnex_seller_requires_membership', '1');
          }
        }
      } catch {
        // If membership API fails, fall back to login flag rather than locking forever
        if (!cancelled) {
          setNeedsMembership(localStorage.getItem('shippnex_seller_requires_membership') === '1');
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (checking) {
    return <PageSkeleton />;
  }

  if (needsMembership) {
    return <Navigate to="/seller/membership" replace />;
  }

  return <Outlet />;
};

export default SellerMembershipGate;
