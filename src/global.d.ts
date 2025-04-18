interface Window {
    fastlink: {
        open: (config: {
            fastLinkURL: string;
            accessToken: string;
            params: Record<string, any>;
            onSuccess?: (data: any) => void;
            onError?: (data: any) => void;
            onClose?: (data: any) => void;
            onEvent?: (data: any) => void;
        }, containerId: string) => void;
    };
}
