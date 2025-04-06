
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Dell XPS 15', quantidade: 5 },
  { name: 'MacBook Pro', quantidade: 3 },
  { name: 'Lenovo ThinkPad', quantidade: 8 },
  { name: 'HP Pavilion', quantidade: 2 },
  { name: 'Acer Nitro', quantidade: 4 },
];

const StockAlertChart = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Alertas de Estoque</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                interval={0}
                angle={-45} 
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#4FD1C5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAlertChart;
