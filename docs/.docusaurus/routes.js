import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/climaseguro-docs/',
    component: ComponentCreator('/climaseguro-docs/', 'eb6'),
    routes: [
      {
        path: '/climaseguro-docs/',
        component: ComponentCreator('/climaseguro-docs/', 'e75'),
        routes: [
          {
            path: '/climaseguro-docs/',
            component: ComponentCreator('/climaseguro-docs/', '003'),
            routes: [
              {
                path: '/climaseguro-docs/analise-financeira-tecnica',
                component: ComponentCreator('/climaseguro-docs/analise-financeira-tecnica', '488'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/climaseguro-docs/entendimento-problema',
                component: ComponentCreator('/climaseguro-docs/entendimento-problema', '6a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/climaseguro-docs/equipe',
                component: ComponentCreator('/climaseguro-docs/equipe', '931'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/climaseguro-docs/impacto',
                component: ComponentCreator('/climaseguro-docs/impacto', '4a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/climaseguro-docs/roadmap',
                component: ComponentCreator('/climaseguro-docs/roadmap', '2e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/climaseguro-docs/solucao',
                component: ComponentCreator('/climaseguro-docs/solucao', 'f42'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/climaseguro-docs/',
                component: ComponentCreator('/climaseguro-docs/', 'b34'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
