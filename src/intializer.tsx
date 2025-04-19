import React, { useEffect, useState } from "react";
import ErrorPage from "./error";

enum ApplicationKind {
    ERROR = "ERROR",
    YODLEE_FASTLINK = "YODLEE_FASTLINK",
}

type Application = {
    applicationKind: ApplicationKind;
    messages?: Record<string, any>;
    sourceId?: string;
    yodleeToken?: string;
};

function Error(errorMessage?: any) {
    return {
        applicationKind: ApplicationKind.ERROR,
        messages: errorMessage
    };
}

const createApplication = (urlParams: Record<string, any>): Application => {
   
    if (!urlParams || Object.keys(urlParams).length === 0) {
        return Error();
    }

    if (!("source_id" in urlParams)) {
        return Error("source_id is missing.") ;
    }

    const sourceId = urlParams.source_id;

    if (sourceId === "yodlee") {
        const ybearer = urlParams.yodlee_token;

        if (!ybearer || ybearer.trim() === "") {
            return Error(`Token is missing`);
        }

        return {
            applicationKind: ApplicationKind.YODLEE_FASTLINK,
            sourceId,
            yodleeToken: ybearer,
        };
    }

    return Error();
}


export const ApplicationInitializer: React.FC = () => {
    const [application, setApplication] = useState<Application | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlParams: Record<string, string> = {};
        params.forEach((value, key) => {
            urlParams[key] = value;
        });

        const app = createApplication(urlParams);

        setApplication(app);
    }, []);

    const openWidget = () => {
        if (!application || !application.yodleeToken) {
            return Error();
        }
        setIsOpen(true);
        window.fastlink.open(
            {
                fastLinkURL: 'https://fl4.preprod.yodlee.com/authenticate/USDevexPreProd3-146/fastlink?channelAppName=usdevexpreprod3',
                accessToken: `Bearer ${application.yodleeToken}`,
                params: {
                    configName: 'ConfigAggVerif',
                },
                onSuccess: (data: any) => console.log('Success:', data),
                onError: (data: any) => Error({ message: data.message})
            },
            'container-fastlink'
        );
    }

    return (
        <div>
            {application?.applicationKind === ApplicationKind.ERROR ? (
                <div> <ErrorPage subError={application.messages && JSON.stringify(application.messages)} /></div>
            ) : (
                <div id="container-fastlink">
                    <div style={{ textAlign: "center" }}>
                        {!isOpen &&<input type="submit" id="btn-fastlink" value="Link an Account" onClick={openWidget} />}
                    </div>
                </div>
            )}
        </div>
    )
}

