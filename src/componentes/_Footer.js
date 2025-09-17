import React from 'react';

const footerStyle = {
    width: '100%',
    padding: '1rem 0',
    background: '#f5f5f5',
    color: '#333',
    textAlign: 'center',
    borderTop: '1px solid #eaeaea',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 100,
    fontFamily: 'sans-serif'
};

export default function _Footer() {
    return (
        <footer style={footerStyle}>
            © {new Date().getFullYear()} Agro Patricia. Todos os direitos reservados.
        </footer>
    );
}