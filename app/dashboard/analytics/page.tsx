"use client";

import { useAdminUser } from "../components/AdminShell";
import AnalyticsScreen from "../components/AnalyticsScreen";

export default function AnalyticsPage() {
  return <AnalyticsScreen user={useAdminUser()} />;
}
