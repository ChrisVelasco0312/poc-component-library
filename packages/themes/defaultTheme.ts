import { Theme } from './Theme';

// Default theme - clean, professional, and accessible
// Based on neutral grays with a subtle blue accent
export const defaultTheme: Theme = {
  colors: {
    // Professional blue-gray primary
    primary: [
      "#1E293B", // 900 - darkest
      "#334155", // 800
      "#475569", // 700
      "#64748B", // 600
      "#3B82F6", // 500 - main brand (clean blue)
      "#60A5FA", // 400
      "#93C5FD", // 300
      "#DBEAFE", // 200 - lightest
    ],
    // Clean neutrals for secondary
    secondary: [
      "#111827", // 900 - darkest
      "#1F2937", // 800
      "#374151", // 700
      "#4B5563", // 600
      "#6B7280", // 500
      "#9CA3AF", // 400
      "#D1D5DB", // 300
      "#F3F4F6", // 200 - lightest
    ],
    // Subtle accent
    tertiary: [
      "#1F2937", // 900
      "#374151", // 800
      "#4B5563", // 700
      "#6B7280", // 600
      "#9CA3AF", // 500
      "#D1D5DB", // 400
      "#E5E7EB", // 300
      "#F9FAFB", // 200
    ],
    // Standard semantic colors
    success: [
      "#14532D", // 900
      "#166534", // 800
      "#15803D", // 700
      "#16A34A", // 600
      "#22C55E", // 500
      "#4ADE80", // 400
      "#86EFAC", // 300
      "#BBF7D0", // 200
    ],
    warning: [
      "#92400E", // 900
      "#B45309", // 800
      "#D97706", // 700
      "#F59E0B", // 600
      "#FBBF24", // 500
      "#FCD34D", // 400
      "#FDE68A", // 300
      "#FEF3C7", // 200
    ],
    error: [
      "#7F1D1D", // 900
      "#991B1B", // 800
      "#DC2626", // 700
      "#EF4444", // 600
      "#F87171", // 500
      "#FCA5A5", // 400
      "#FECACA", // 300
      "#FEE2E2", // 200
    ],
    info: [
      "#1E3A8A", // 900
      "#1E40AF", // 800
      "#1D4ED8", // 700
      "#2563EB", // 600
      "#3B82F6", // 500
      "#60A5FA", // 400
      "#93C5FD", // 300
      "#DBEAFE", // 200
    ],
  },
}; 