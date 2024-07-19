import { Container } from "react-bootstrap";
const Footer = () => {
    return ( <footer className="footer text-center mt-5">
    <Container>
      <p>&copy; {new Date().getFullYear()} Blog Panel. All rights reserved.</p>
      <a href="/privacy.html">Privacy Policy</a> | <a href="/terms.html">Terms of Service</a>
    </Container>
  </footer> );
}
 
export default Footer;