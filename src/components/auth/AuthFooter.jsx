export default function AuthFooter({ showImpact = false }) {
  return <footer className="auth-footer">
    <p className="auth-tagline">Creators. Brands. Ideas.</p>
    {showImpact && <p className="auth-impact">Real people. Real stories. Real impact.</p>}
  </footer>;
}
