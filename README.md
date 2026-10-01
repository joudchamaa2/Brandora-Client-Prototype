# Brandora — Interactive Client Prototype

A standalone, frontend-only demo of the Brandora platform. It contains two experiences:

- **Customer App** — mobile app shown in a phone frame (splash → discovery → cart → cash-on-delivery checkout → live tracking → rating)
- **Business Dashboard** — store onboarding (plan → demo payment → logo → theme generation → preview → submit) and a desktop store-admin dashboard

Everything uses mock data. There is no backend, no authentication, no real payments, and no connection to the Flutter app or Laravel API.

## Run

```bash
npm install
npm run dev
```

Other scripts: `npm run build` (type-check + production build), `npm run typecheck`, `npm run preview`.

Use **Restart demo** (top-right) to clear all demo state (cart, orders, store setup) and start again from the splash screen. Demo state is persisted in `localStorage` under the `brandora:` prefix.

## Presenter tips

- The switcher at the top jumps between the two experiences and resumes where you left off.
- Orders placed in the customer app for **Nova Streetwear** appear live (tagged *Live*) in the dashboard's Orders page.
- On the order tracking screen, the **Demo: In progress / Delivered** toggle jumps between the two tracking states. New orders also advance automatically (~30 s to delivered).
- In onboarding, the logo you pick drives the generated storefront palette. Logo and theme can be changed live on the Preview step and in the Website Builder.

## Structure

```
src/
  data/          Centralized mock data + TypeScript types (stores, products, orders, plans,
                 logos, themes, analytics, staff, offers, admin orders/products)
  context/       React context state: CustomerContext, BusinessContext, ToastContext
  lib/           Utilities, color math, storeTheme.ts (logo + theme → storefront design system),
                 localStorage-backed state hook
  layouts/       CustomerLayout (phone frame), BusinessOnboardingLayout, BusinessDashboardLayout
  components/
    shared/      BrandLogo, PresentationBar, Button, Modal/Drawer, Segmented, StatusBadge,
                 EmptyState, ToastViewport, AnimatedNumber, SuccessCheck, PageTransition
    customer/    PhoneFrame, CustomerBottomNav, StoreCard, ProductCard, OrderCard, SearchBar, HeartButton
    business/    BusinessSidebar, BusinessTopbar, StorefrontPreview, PlanCard, LogoCard, ThemeCard,
                 StepIndicator, DashboardUI (StatCard, ChartCard, Table…)
    charts/      AreaChart, BarChart, DonutChart, Sparkline (animated SVG, no chart library)
    visuals/     Generated imagery: ProductArt, StoreCover/StoreLogo, LogoMark (works offline)
  pages/
    customer/    All customer screens
    business/    onboarding/* and dashboard/*
```

## Tech

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · React Router · Lucide icons · self-hosted fonts via Fontsource (no external image or font URLs at runtime).
