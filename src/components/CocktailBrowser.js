import React, { useState, useEffect } from "react";
import CocktailList from "./CocktailList";
import CocktailFilter from "./CocktailFilter";
import { applyFilters, filtersFromUserOptions } from "../utilities/filter";
import { LinearProgress } from "@material-ui/core";
import { useSelector } from "react-redux";

const CocktailBrowser = () => {
  const allCocktails = useSelector(state => state.db.cocktails);
  const filterOptions = useSelector(state => state.filterOptions);
  const bar = useSelector(state => state.bar);

  const [filteredCocktails, setFilteredCocktails] = useState(allCocktails);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    applyFilters(allCocktails, filtersFromUserOptions(filterOptions, bar))
      .then(cocktails => {
        return cocktails.sort((a, b) => (a.name > b.name ? 1 : -1));
      })
      .then(cocktails => {
        // an artificial delay helps avoid animation janking
        // and provides a less jarring user experience.
        setTimeout(() => {
          setFilteredCocktails(cocktails);
          setLoading(false);
        }, 500);
      });
  }, [filterOptions, bar, allCocktails]);

  return (
    <div>
      <CocktailFilter />
      {loading && <LinearProgress />}
      {!loading && <CocktailList cocktails={filteredCocktails} />}
    </div>
  );
};

export default React.memo(CocktailBrowser);
