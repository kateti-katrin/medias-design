// application.js — site-001 entry point
import "@hotwired/turbo-rails";
import "./controllers";
import { mountBriefQuiz } from "./components/brief_quiz";
import { mountBudgetCalculator } from "./components/budget_calculator";
import { mountArticlesFilters } from "./components/articles_index_filters";
import { mountArticleEngagement } from "./components/article_engagement";
import { mountArticleReactions } from "./components/article_reactions";
import { mountStickyNav } from "./components/sticky_nav";
import { mountTypograf } from "./components/typograf";

document.addEventListener("turbo:load", () => {
  mountBriefQuiz();
  mountBudgetCalculator();
  mountArticlesFilters();
  mountArticleEngagement();
  mountArticleReactions();
  mountStickyNav();
  mountTypograf();
});

import "trix"
import "@rails/actiontext"
