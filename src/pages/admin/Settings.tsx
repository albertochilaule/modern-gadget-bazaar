
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Define the interfaces for our settings types
interface GeneralSettings {
  storeName: string;
  email: string;
  phone: string;
  description: string;
}

interface CommentSettings {
  enableComments: boolean;
  moderateComments: boolean;
  allowGuestComments: boolean;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  newOrderNotification: boolean;
  lowStockNotification: boolean;
  customerMessageNotification: boolean;
  systemUpdateNotification: boolean;
}

interface AccessSettings {
  accessHours: {
    start: string;
    end: string;
  };
  daysOfWeek: string[];
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
}

interface BackupSettings {
  autoBackup: boolean;
  frequency: string;
  storagePath: string;
  retentionDays: number;
}

interface AllSettings {
  general: GeneralSettings;
  comments: CommentSettings;
  notifications: NotificationSettings;
  access: AccessSettings;
  security: SecuritySettings;
  backup: BackupSettings;
}

const defaultSettings: AllSettings = {
  general: {
    storeName: "Century Tech",
    email: "info@centurytech.com",
    phone: "+258 84 123 4567",
    description: "Loja especializada em produtos tecnológicos",
  },
  comments: {
    enableComments: true,
    moderateComments: true,
    allowGuestComments: false,
  },
  notifications: {
    email: true,
    sms: true,
    newOrderNotification: true,
    lowStockNotification: true,
    customerMessageNotification: true,
    systemUpdateNotification: true,
  },
  access: {
    accessHours: {
      start: "08:00",
      end: "18:00",
    },
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "Mínimo 8 caracteres, incluindo números e letras",
  },
  backup: {
    autoBackup: true,
    frequency: "daily",
    storagePath: "/backups",
    retentionDays: 30,
  }
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error("Error parsing settings from localStorage:", error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate an API call
    setTimeout(() => {
      try {
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        toast({
          title: "Configurações salvas",
          description: "Suas configurações foram atualizadas com sucesso.",
          variant: "success",
        });
        setIsSaving(false);
      } catch (error) {
        toast({
          title: "Erro ao salvar",
          description: "Houve um problema ao salvar suas configurações.",
          variant: "destructive",
        });
        setIsSaving(false);
      }
    }, 1000);
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem('adminSettings', JSON.stringify(defaultSettings));
    setIsResetDialogOpen(false);
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
      variant: "success",
    });
  };

  // General settings handlers
  const updateGeneralSetting = <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K]
  ) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [key]: value,
      },
    });
  };

  // Comment settings handlers
  const updateCommentSetting = <K extends keyof CommentSettings>(
    key: K,
    value: CommentSettings[K]
  ) => {
    setSettings({
      ...settings,
      comments: {
        ...settings.comments,
        [key]: value,
      },
    });
  };

  // Notification settings handlers
  const updateNotificationSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  // Access settings handlers
  const updateAccessHours = (start?: string, end?: string) => {
    setSettings({
      ...settings,
      access: {
        ...settings.access,
        accessHours: {
          start: start || settings.access.accessHours.start,
          end: end || settings.access.accessHours.end,
        },
      },
    });
  };

  const updateDaysOfWeek = (days: string[]) => {
    setSettings({
      ...settings,
      access: {
        ...settings.access,
        daysOfWeek: days,
      },
    });
  };

  // Security settings handlers
  const updateSecuritySetting = <K extends keyof SecuritySettings>(
    key: K,
    value: SecuritySettings[K]
  ) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value,
      },
    });
  };

  // Backup settings handlers
  const updateBackupSetting = <K extends keyof BackupSettings>(
    key: K,
    value: BackupSettings[K]
  ) => {
    setSettings({
      ...settings,
      backup: {
        ...settings.backup,
        [key]: value,
      },
    });
  };

  const days = [
    { value: "monday", label: "Segunda-feira" },
    { value: "tuesday", label: "Terça-feira" },
    { value: "wednesday", label: "Quarta-feira" },
    { value: "thursday", label: "Quinta-feira" },
    { value: "friday", label: "Sexta-feira" },
    { value: "saturday", label: "Sábado" },
    { value: "sunday", label: "Domingo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <div className="space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setIsResetDialogOpen(true)}
          >
            Restaurar Padrões
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as informações básicas da loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Nome da Loja</Label>
            <Input 
              id="storeName" 
              value={settings.general.storeName} 
              onChange={(e) => updateGeneralSetting("storeName", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeEmail">E-mail de Contato</Label>
            <Input 
              id="storeEmail" 
              type="email"
              value={settings.general.email} 
              onChange={(e) => updateGeneralSetting("email", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storePhone">Telefone</Label>
            <Input 
              id="storePhone" 
              value={settings.general.phone} 
              onChange={(e) => updateGeneralSetting("phone", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeDescription">Descrição da Loja</Label>
            <Textarea 
              id="storeDescription" 
              value={settings.general.description} 
              onChange={(e) => updateGeneralSetting("description", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Comentários</CardTitle>
          <CardDescription>
            Gerencie as opções de comentários no site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableComments">Habilitar comentários</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que os usuários comentem nos produtos
              </p>
            </div>
            <Switch 
              id="enableComments"
              checked={settings.comments.enableComments}
              onCheckedChange={(checked) => updateCommentSetting("enableComments", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="moderateComments">Moderar comentários</Label>
              <p className="text-sm text-muted-foreground">
                Revisar comentários antes de publicá-los
              </p>
            </div>
            <Switch 
              id="moderateComments"
              checked={settings.comments.moderateComments}
              onCheckedChange={(checked) => updateCommentSetting("moderateComments", checked)}
              disabled={!settings.comments.enableComments}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowGuestComments">Permitir comentários anônimos</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que visitantes não registrados comentem
              </p>
            </div>
            <Switch 
              id="allowGuestComments"
              checked={settings.comments.allowGuestComments}
              onCheckedChange={(checked) => updateCommentSetting("allowGuestComments", checked)}
              disabled={!settings.comments.enableComments}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
          <CardDescription>
            Configure como deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tipos de Notificação</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emailNotification" 
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => 
                    updateNotificationSetting("email", checked === true)
                  }
                />
                <Label htmlFor="emailNotification">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="smsNotification" 
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => 
                    updateNotificationSetting("sms", checked === true)
                  }
                />
                <Label htmlFor="smsNotification">SMS</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-medium">Eventos para Notificar</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="newOrder" 
                  checked={settings.notifications.newOrderNotification}
                  onCheckedChange={(checked) => 
                    updateNotificationSetting("newOrderNotification", checked === true)
                  }
                />
                <Label htmlFor="newOrder">Novo pedido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lowStock" 
                  checked={settings.notifications.lowStockNotification}
                  onCheckedChange={(checked) => 
                    updateNotificationSetting("lowStockNotification", checked === true)
                  }
                />
                <Label htmlFor="lowStock">Baixo estoque</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="customerMessage" 
                  checked={settings.notifications.customerMessageNotification}
                  onCheckedChange={(checked) => 
                    updateNotificationSetting("customerMessageNotification", checked === true)
                  }
                />
                <Label htmlFor="customerMessage">Mensagem de cliente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="systemUpdate" 
                  checked={settings.notifications.systemUpdateNotification}
                  onCheckedChange={(checked) => 
                    updateNotificationSetting("systemUpdateNotification", checked === true)
                  }
                />
                <Label htmlFor="systemUpdate">Atualização do sistema</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Horário de Acesso</CardTitle>
          <CardDescription>
            Defina o horário de funcionamento da loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de Funcionamento</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="startTime"
                  type="time"
                  className="w-32"
                  value={settings.access.accessHours.start}
                  onChange={(e) => updateAccessHours(e.target.value, undefined)}
                />
                <span>até</span>
                <Input 
                  id="endTime"
                  type="time"
                  className="w-32"
                  value={settings.access.accessHours.end}
                  onChange={(e) => updateAccessHours(undefined, e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label>Dias de Funcionamento</Label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <Badge 
                  key={day.value}
                  variant={settings.access.daysOfWeek.includes(day.value) ? "success" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const isSelected = settings.access.daysOfWeek.includes(day.value);
                    if (isSelected) {
                      updateDaysOfWeek(settings.access.daysOfWeek.filter(d => d !== day.value));
                    } else {
                      updateDaysOfWeek([...settings.access.daysOfWeek, day.value]);
                    }
                  }}
                >
                  {day.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Segurança</CardTitle>
          <CardDescription>
            Configure as opções de segurança do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth">Autenticação em duas etapas</Label>
              <p className="text-sm text-muted-foreground">
                Exigir verificação adicional ao fazer login
              </p>
            </div>
            <Switch 
              id="twoFactorAuth"
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => updateSecuritySetting("twoFactorAuth", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">
              Tempo de expiração da sessão (em minutos)
            </Label>
            <Input 
              id="sessionTimeout"
              type="number"
              min="5"
              max="180"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSecuritySetting("sessionTimeout", parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordPolicy">Política de senha</Label>
            <Textarea
              id="passwordPolicy"
              value={settings.security.passwordPolicy}
              onChange={(e) => updateSecuritySetting("passwordPolicy", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Backup</CardTitle>
          <CardDescription>
            Configure as opções de backup do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoBackup">Backup automático</Label>
              <p className="text-sm text-muted-foreground">
                Realizar backups automáticos do sistema
              </p>
            </div>
            <Switch 
              id="autoBackup"
              checked={settings.backup.autoBackup}
              onCheckedChange={(checked) => updateBackupSetting("autoBackup", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Frequência de backup</Label>
            <ToggleGroup 
              type="single" 
              value={settings.backup.frequency}
              onValueChange={(value) => {
                if (value) updateBackupSetting("frequency", value)
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="hourly">Por hora</ToggleGroupItem>
              <ToggleGroupItem value="daily">Diário</ToggleGroupItem>
              <ToggleGroupItem value="weekly">Semanal</ToggleGroupItem>
              <ToggleGroupItem value="monthly">Mensal</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storagePath">Local de armazenamento</Label>
            <Input 
              id="storagePath"
              value={settings.backup.storagePath}
              onChange={(e) => updateBackupSetting("storagePath", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retentionDays">
              Dias de retenção de backup
            </Label>
            <Input 
              id="retentionDays"
              type="number"
              min="1"
              max="365"
              value={settings.backup.retentionDays}
              onChange={(e) => updateBackupSetting("retentionDays", parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar configurações padrão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja restaurar todas as configurações para seus valores padrão? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetToDefaults}
            >
              Sim, restaurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;
