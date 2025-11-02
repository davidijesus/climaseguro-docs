import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoSvg from "@/assets/clima-seguro-logo.svg";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-accent to-primary">
      <div className="mx-4 w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logoSvg} 
            alt="ClimaSeguro" 
            className="h-24 w-auto"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary-foreground">
            ClimaSeguro
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Prevenir é mais barato que remediar
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4 pt-8">
          <Button
            onClick={() => navigate("/climaseguro")}
            size="lg"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg h-16 shadow-lg"
          >
            <span className="mr-2">🌍</span>
            Entrar como ClimaSeguro
          </Button>

          <Button
            onClick={() => navigate("/prefeitura/curitiba")}
            size="lg"
            variant="secondary"
            className="w-full text-lg h-16 shadow-lg"
          >
            <span className="mr-2">🏛️</span>
            Entrar como Prefeitura (Curitiba)
          </Button>
        </div>

        {/* Footer info */}
        <p className="text-sm text-primary-foreground/70 pt-8">
          Plataforma de análise de risco de desastres naturais
        </p>
      </div>
    </div>
  );
};

export default Login;
