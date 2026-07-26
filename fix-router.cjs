const fs = require('fs');
let content = fs.readFileSync('src/app/Router.tsx', 'utf8');

content = content.replace("import { createBrowserRouter, Navigate } from 'react-router-dom';", "import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';");

const loginElement = `const LoginWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage onNavigate={(path) => {
    if (path === 'dashboard') navigate('/command-center');
    else if (path === 'register') navigate('/register');
    else if (path === 'forgot-password') navigate('/forgot-password');
    else navigate('/');
  }} />;
};`;

content = content.replace("// Legacy Login Page", `${loginElement}\n// Legacy Login Page`);

content = content.replace("<LoginPage onNavigate={() => {}} />", "<LoginWrapper />");

fs.writeFileSync('src/app/Router.tsx', content, 'utf8');
