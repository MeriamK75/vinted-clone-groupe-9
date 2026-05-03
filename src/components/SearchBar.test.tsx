import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

const noOp = () => {};

describe("SearchBar", () => {
  it("affiche le champ de recherche avec le bon placeholder", () => {
    render(
      <SearchBar
        onSearch={noOp}
        onCategoryChange={noOp}
        onConditionChange={noOp}
        onPriceMinChange={noOp}
        onPriceMaxChange={noOp}
        onSortChange={noOp}
      />
    );

    expect(
      screen.getByPlaceholderText("Rechercher un article...")
    ).toBeInTheDocument();
  });

  it("appelle onSearch quand l'utilisateur tape", async () => {
    const onSearch = vi.fn();

    render(
      <SearchBar
        onSearch={onSearch}
        onCategoryChange={noOp}
        onConditionChange={noOp}
        onPriceMinChange={noOp}
        onPriceMaxChange={noOp}
        onSortChange={noOp}
      />
    );

    await userEvent.type(
      screen.getByPlaceholderText("Rechercher un article..."),
      "veste"
    );

    expect(onSearch).toHaveBeenCalledWith("veste");
  });
});
