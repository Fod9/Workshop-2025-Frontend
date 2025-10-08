import "../../styles/components/header.css"

interface HeaderProps {
  title: string;
}

export default function Header({title}: HeaderProps) {
    return (
        <div className="header-container">
            <img src="/assets/logo-light.svg" className="logo" alt="Logo" />
            <p className="header-title">{title}</p>
        </div>
    );
}