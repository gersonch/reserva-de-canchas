// toastConfig.ts
import { JSX } from "react";
import {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";

export const toastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4CAF50",
        backgroundColor: "#e8f5e9",
        borderRadius: 12,
        paddingBlock: 20,
        height: 80,
        width: "90%",
      }}
      text1Style={{
        fontSize: 20,
        fontWeight: "bold",
        color: "#2e7d32",
      }}
      text2Style={{
        fontSize: 16,
        color: "#388e3c",
      }}
    />
  ),
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#f44336",
        backgroundColor: "#ffebee",
        borderRadius: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#c62828",
      }}
      text2Style={{
        fontSize: 14,
        color: "#d32f2f",
      }}
    />
  ),
};
