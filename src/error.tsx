interface ErrorPageProps {
    subError?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ subError = '' }) => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Something went wrong!</h1>
            {subError && <p style={{ marginTop: '1rem' }}>{subError}</p>}
        </div>
    );
};

export default ErrorPage;