export const getServerSideProps = async () => {
    return { notFound: true };
};

const CatchAll = () => {
    return null;
};

export default CatchAll;