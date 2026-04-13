import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFileStore, useSettingsStore } from '@/stores';
import { Button } from '@/components/ui';
import { FileDropZone } from '@/components/file';
import { formatSize } from '@/lib/utils/format';
import { getRizinVersion } from '@/lib/utils/version';
import { getCachedAnalysisEntry, listCachedAnalyses, type CachedAnalysisSummary } from '@/lib/rizin';
import { Github, Moon, Sun, Terminal, Cpu, Lock, Code2 } from 'lucide-react';
import { useTheme } from '@/providers';

export default function HomePage() {
  const navigate = useNavigate();
  const { setCurrentFile, recentFiles } = useFileStore();
  const { cacheVersions, setCacheVersions } = useSettingsStore();
  const { setTheme, resolvedTheme } = useTheme();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openingCachedHash, setOpeningCachedHash] = useState<string | null>(null);
  const [rizinVersion, setRizinVersion] = useState('...');
  const [cachedEntries, setCachedEntries] = useState<CachedAnalysisSummary[]>([]);

  useEffect(() => {
    getRizinVersion().then(setRizinVersion);
    listCachedAnalyses().then(setCachedEntries);
  }, []);

  const handleFileSelect = useCallback((nextFile: File) => {
    setFile(nextFile);
  }, []);

  const launchBinary = useCallback((params: {
    name: string;
    data: Uint8Array;
    size: number;
    useCache: boolean;
  }) => {
    setCurrentFile({
      id: crypto.randomUUID(),
      name: params.name,
      data: params.data,
      size: params.size,
      loadedAt: Date.now(),
    });
    navigate(`/analyze?cache=${params.useCache}`);
  }, [navigate, setCurrentFile]);

  const handleOpenRizin = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      launchBinary({
        name: file.name,
        data: new Uint8Array(arrayBuffer),
        size: file.size,
        useCache: cacheVersions,
      });
    } catch {
      toast.error('선택한 바이너리를 열 수 없습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [cacheVersions, file, launchBinary]);

  const handleOpenCachedBinary = useCallback(async (hash: string) => {
    setOpeningCachedHash(hash);
    try {
      const cached = await getCachedAnalysisEntry(hash);
      if (!cached) {
        toast.error('해당 캐시 분석 데이터를 더 이상 사용할 수 없습니다.');
        setCachedEntries(await listCachedAnalyses());
        return;
      }

      if (!(cached.binaryData instanceof Uint8Array) || cached.binaryData.byteLength === 0) {
        toast.error('이전 캐시 항목에는 파싱된 메타데이터만 포함되어 있습니다. 홈에서 바로 다시 열 수 있도록 바이너리를 한 번 더 분석하세요.');
        return;
      }

      launchBinary({
        name: cached.fileName,
        data: new Uint8Array(cached.binaryData),
        size: cached.fileSize,
        useCache: true,
      });
    } catch {
      toast.error('캐시된 바이너리를 지금 다시 열 수 없습니다.');
    } finally {
      setOpeningCachedHash(null);
    }
  }, [launchBinary]);

  const formatHash = useCallback((hash: string) => `${hash.slice(0, 12)}...${hash.slice(-6)}`, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-mono font-bold text-primary">RzWeb</span>
          <span className="text-[10px] font-mono text-muted-foreground">v{rizinVersion}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/IndAlok/rzweb" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center sm:mb-8">
            <pre className="inline-block text-[8px] leading-tight text-primary sm:text-xs font-mono">
{`  ____       __        __   _
 |  _ \\ ____\\ \\      / /__| |__
 | |_) |_  / \\ \\ /\\ / / _ \\ '_ \\
 |  _ < / /   \\ V  V /  __/ |_) |
 |_| \\_\\___|   \\_/\\_/ \\___|_.__/ `}
            </pre>
            <p className="mt-4 text-sm font-mono text-foreground/80">
              브라우저 기반 리버스 엔지니어링
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs font-mono text-muted-foreground">
              브라우저에서 바이너리를 직접 분석하세요. 업로드 없이, 서버 없이.
              WebAssembly로 컴파일된 Rizin 기반.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
            <FileDropZone
              onFileSelect={handleFileSelect}
              selectedFile={file}
              onClear={() => setFile(null)}
            />

            <div className="mt-4 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-mono text-muted-foreground">
                <input
                  type="checkbox"
                  checked={cacheVersions}
                  onChange={(event) => setCacheVersions(event.target.checked)}
                  className="h-3 w-3 rounded border-border"
                />
                오프라인 캐시
              </label>
              <Button
                onClick={handleOpenRizin}
                disabled={!file || isProcessing}
                loading={isProcessing}
              >
                분석
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Cpu className="h-4 w-4 text-primary" />
              <span>WASM 구동</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <span>100% 프라이빗</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>전체 CLI 접근</span>
            </div>
          </div>

          {cachedEntries.length > 0 && (
            <div className="mt-6 rounded border border-border bg-card/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[10px] font-mono text-muted-foreground">오프라인 캐시:</p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  캐시된 파일을 클릭하여 즉시 다시 열기
                </p>
              </div>
              <div className="space-y-2">
                {cachedEntries.slice(0, 5).map((entry) => {
                  const isOpening = openingCachedHash === entry.hash;
                  return (
                    <button
                      key={entry.hash}
                      type="button"
                      onClick={() => void handleOpenCachedBinary(entry.hash)}
                      disabled={!entry.hasBinaryData || isOpening}
                      className="flex w-full items-center justify-between gap-3 rounded border border-border/60 bg-background/40 px-3 py-2 text-left transition hover:border-primary/40 hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-xs font-mono text-foreground">{entry.fileName}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground">
                          <span>{formatSize(entry.fileSize)}</span>
                          <span>{formatHash(entry.hash)}</span>
                          <span>{entry.hasBinaryData ? '실행 가능' : '메타데이터만'}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-[10px] font-mono text-primary">
                        {isOpening ? '여는 중...' : entry.hasBinaryData ? '열기' : '재분석'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {recentFiles.length > 0 && (
            <div className="mt-4 rounded border border-border bg-card/50 p-3">
              <p className="mb-2 text-[10px] font-mono text-muted-foreground">최근:</p>
              <div className="space-y-1">
                {recentFiles.slice(0, 3).map((recentFile) => (
                  <div key={`${recentFile.name}-${recentFile.loadedAt}`} className="flex justify-between text-xs font-mono">
                    <span className="max-w-[200px] truncate text-foreground">{recentFile.name}</span>
                    <span className="text-muted-foreground">{formatSize(recentFile.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground">
          <span>
            제작:{' '}
            <a href="https://rizin.re" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Rizin
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
