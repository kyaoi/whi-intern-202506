import { GlobalContainer } from '@/components/GlobalContainer';
import type { Metadata } from 'next';
import { SearchEmployees } from '../components/SearchEmployees';

export const metadata: Metadata = {
  title: 'タレントマネジメントシステム | 社員検索',
  description: 'シンプルなタレントマネジメントシステム',
};

export default function Home() {
  return (
    <GlobalContainer title="社員検索">
      <SearchEmployees />
    </GlobalContainer>
  );
}
