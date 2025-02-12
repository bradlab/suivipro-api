import { RuleEnum } from './enum/rule.enum';

export const RULES = [
  {
    designation: 'Gestion des categories',
    description: 'Gérer tout ce qui concerne les categories',
    tag: null,
    permissions: [
      {
        designation: 'Afficher les categories',
        value: RuleEnum.CAN_SHOW_CATEGORY_LIST,
        description: null,
      },
      {
        designation: 'Afficher une categorie',
        value: RuleEnum.CAN_SHOW_CATEGORY,
        description: null,
      },
      // GESTION DES ATTRIBUTS
      {
        designation: 'Afficher les attributs',
        value: RuleEnum.CAN_SHOW_ATTRIBUTE_LIST,
        description: null,
      },
      {
        designation: 'Afficher un attribut',
        value: RuleEnum.CAN_SHOW_ATTRIBUTE,
        description: null,
      },
    ],
  },
  {
    designation: 'Gestion des ressources (Produits & Services)',
    description: 'Gérer tout ce qui concerne les produits',
    tag: null,
    permissions: [
      {
        designation: 'Afficher la liste des produits',
        value: RuleEnum.CAN_SHOW_PRODUCT_LIST,
        description: null,
      },
      {
        designation: "Afficher les informations d'un produit",
        value: RuleEnum.CAN_SHOW_PRODUCT,
        description: null,
      },
      {
        designation: 'Modifier un produit',
        value: RuleEnum.CAN_UPDATE_PRODUCT,
        description: null,
      },
    ],
  },
  {
    designation: 'Gestion des opérations',
    description:
      'Gérer des opération pour mieux les tracés leur historique et faire des statistiques',
    tag: null,
    permissions: [
      {
        designation: 'Afficher la liste de toutes les opérations',
        value: RuleEnum.CAN_SHOW_OPERATION_LIST,
        description: null,
      },
    ],
  },
];
