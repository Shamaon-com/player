
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";

Amplify.configure(awsconfig);


const App = ({ Component, pageProps }) => {
 return <Component {...pageProps} />
}

export default App