import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Logo />
        <h1 className="text-lg font-semibold tracking-tight">
          EdgeSight Logistics
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
