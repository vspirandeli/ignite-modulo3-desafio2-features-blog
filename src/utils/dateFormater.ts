// Modules
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

// Utils
import { capitalize } from './capitalize';

export function dateFormat(date: string): string {
  let formatedDate = '';
  const newDate = format(parseISO(date), 'dd MMM yyyy', { locale: ptBR });
  const splitedDate = newDate.split(' ');
  const month = splitedDate[1];

  const formatedMonth = capitalize(month);
  formatedDate = `${splitedDate[0]} ${formatedMonth} ${splitedDate[2]}`;

  return newDate;
}
