import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {QueryClient, QueryClientProvider} from "react-query";
import { AppContextProvider } from './contexts/AppContext.tsx';
import { SearchContextProvider } from './contexts/SearchContext.tsx';
//for connecting our react-queery. wrap our app in the QueryClientProvider

const queryclient=new QueryClient({
    defaultOptions:{
       queries:{
          retry:0,
       },
    },
  })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* in this always pass an props cliet */}
    <QueryClientProvider client={queryclient}>
        <AppContextProvider>
             <SearchContextProvider>
                <App/>
             </SearchContextProvider>
        </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
