export default function PageHeader({ title, description }) {
  return <header className="space-y-1"><h1 className="text-heading-lg font-bold tracking-tight text-text-primary">{title}</h1><p className="text-body-sm text-text-secondary">{description}</p></header>;
}
