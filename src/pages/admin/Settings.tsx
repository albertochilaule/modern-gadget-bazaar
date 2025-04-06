
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Loja</CardTitle>
            <CardDescription>
              Configure as informações principais da sua loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input id="storeName" defaultValue="Century Tech" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email de Contato</Label>
              <Input id="storeEmail" defaultValue="info@centurytech.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Telefone</Label>
              <Input id="storePhone" defaultValue="+258 84 123 4567" />
            </div>
            <Button className="w-full">Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>
              Gerencie os métodos de pagamento disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="creditCard" className="h-4 w-4" defaultChecked />
                <Label htmlFor="creditCard">Cartão de Crédito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="debitCard" className="h-4 w-4" defaultChecked />
                <Label htmlFor="debitCard">Cartão de Débito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="bankTransfer" className="h-4 w-4" defaultChecked />
                <Label htmlFor="bankTransfer">Transferência Bancária</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="mpesa" className="h-4 w-4" defaultChecked />
                <Label htmlFor="mpesa">M-Pesa</Label>
              </div>
            </div>
            <Button className="w-full">Salvar Preferências</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
