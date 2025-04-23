import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingPage = () => {
    return(
        <Container style={{  
          minHeight: "100vh", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
          }}>
            <div className="text-center">
              <Spinner
                  as="span"
                  animation="border"
                  variant="success"
                  size="lg"
                  role="status"
                  aria-hidden="true"
              />
              <p className="mb-0">Loading...</p>
            </div>
        </Container>
      );
};

export default LoadingPage;