import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePWA } from "@/contexts/PWAContext";
import { Download, Monitor, Smartphone, Share } from "lucide-react";

const Install = () => {
    const { install, canInstall, isInstalled } = usePWA();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-24 h-24 mb-6">
                        <img src="/logo.png" alt="Logo Silva e Martinez" className="w-full h-full object-contain" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Instalar Aplicativo</CardTitle>
                    <CardDescription>
                        Tenha acesso rápido e offline ao sistema Silva e Martinez Construções.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isInstalled ? (
                        <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                            <p className="font-medium">O aplicativo já está instalado!</p>
                            <p className="text-sm mt-1">Você pode abri-lo diretamente da sua tela inicial/área de trabalho.</p>
                        </div>
                    ) : (
                        <>
                            {canInstall && (
                                <Button onClick={install} className="w-full h-12 text-lg gap-2">
                                    <Download className="w-5 h-5" />
                                    Instalar Agora
                                </Button>
                            )}

                            {!canInstall && isIOS && (
                                <div className="space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                                    <p className="font-medium text-gray-900">Como instalar no iPhone/iPad:</p>
                                    <ol className="list-decimal list-inside space-y-2">
                                        <li className="flex items-center gap-2">
                                            Toque no botão de compartilhamento <Share className="w-4 h-4" />
                                        </li>
                                        <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                                        <li>Confirme tocando em "Adicionar"</li>
                                    </ol>
                                </div>
                            )}

                            {!canInstall && !isIOS && (
                                <div className="space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                                    <p className="font-medium text-gray-900">Para instalar:</p>
                                    <div className="flex items-start gap-3">
                                        <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <p>No computador: Clique no ícone de instalação na barra de endereço do navegador. Se não aparecer, verifique o menu de configurações.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <p>No celular: Se o botão "Instalar" não aparecer, abra o menu do navegador e procure por "Instalar aplicativo" ou "Adicionar à tela inicial".</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Install;
