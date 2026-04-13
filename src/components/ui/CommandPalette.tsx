import { useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, Code, Terminal, Share2, Quote, Layout, Keyboard, Settings } from 'lucide-react';
import { useUIStore } from '@/stores';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setCurrentView, setSettingsDialogOpen, setShortcutsDialogOpen } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setCommandPaletteOpen(false)}>
      <div 
        className="w-full max-w-[640px] rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex h-full w-full flex-col">
          <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="명령어를 입력하거나 검색..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm">결과를 찾을 수 없습니다.</Command.Empty>
            
            <Command.Group heading="탐색" className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <CommandItem onSelect={() => { setCurrentView('disasm'); setCommandPaletteOpen(false); }}>
                <Code className="mr-2 h-4 w-4" />
                <span>디스어셈블리 보기</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { setCurrentView('graph'); setCommandPaletteOpen(false); }}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>그래프 보기</span>
                <CommandShortcut>⌘G</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { setCurrentView('hex'); setCommandPaletteOpen(false); }}>
                <Layout className="mr-2 h-4 w-4" />
                <span>헥스 뷰 보기</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { setCurrentView('strings'); setCommandPaletteOpen(false); }}>
                <Quote className="mr-2 h-4 w-4" />
                <span>문자열 보기</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { setCurrentView('terminal'); setCommandPaletteOpen(false); }}>
                <Terminal className="mr-2 h-4 w-4" />
                <span>터미널 보기</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
            </Command.Group>

            <Command.Separator className="h-px bg-border my-2" />

            <Command.Group heading="설정 및 정보" className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <CommandItem onSelect={() => { setSettingsDialogOpen(true); setCommandPaletteOpen(false); }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>설정 열기</span>
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => { setShortcutsDialogOpen(true); setCommandPaletteOpen(false); }}>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>키보드 단축키</span>
                <CommandShortcut>⌘/</CommandShortcut>
              </CommandItem>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      {children}
    </Command.Item>
  );
}

function CommandShortcut({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto text-xs tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}
