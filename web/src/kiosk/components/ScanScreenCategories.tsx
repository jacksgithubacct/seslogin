import { useState } from "react";
import { categories as categoriesFixture } from "../../lib/categories";
import type { Category } from "../../lib/categories";

function CategoryButton(props: {
  id: string;
  name: string;
  icon: string;
  onSelect: () => void;
}) {
  const { name, icon, onSelect } = props;
  const iconSrc = `/image/categories-cas/${icon}.png`;

  return (
    <li>
      <button onClick={onSelect}>
        <img src={iconSrc} />
        {name}
      </button>
    </li>
  );
}

export function Inner(props: {
  onSelectCategory: (uuid: string, categoryId: string) => void;
  uuid: string | null;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  let categories;
  if (selectedCategory) {
    categories =
      categoriesFixture.find((c: Category) => c.id === selectedCategory)
        ?.subcategories || [];
  } else {
    categories = categoriesFixture;
  }

  function back() {
    setSelectedCategory(null);
  }

  function select(id: string) {
    if (selectedCategory === null) {
      setSelectedCategory(id);
    } else {
      if (props.uuid === null) {
        throw new Error("UUID is null");
      }
      props.onSelectCategory(props.uuid, id);
    }
  }

  return (
    <>
      <div className="header">
        <span className="breadcrumb">Categories</span>
        {selectedCategory && (
          <button className="back" onClick={back}>
            Back
          </button>
        )}
      </div>
      <ul className="categories">
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            onSelect={() => select(category.id)}
          />
        ))}
      </ul>
    </>
  );
}

// we expose this wrapper just so we can reset inner state on UUID change without
// causing the container <div> to remount and lose CSS transition state
export default function ScanScreenCategories(props: {
  onSelectCategory: (uuid: string, categoryId: string) => void;
  screenPosition: string;
  uuid: string | null;
  smallCategories?: boolean;
}) {
  const className =
    "view categoriesview" + (props.smallCategories ? " small-categories" : "");
  return (
    <div className={className} style={{ left: props.screenPosition }}>
      <Inner
        onSelectCategory={props.onSelectCategory}
        key={props.uuid}
        uuid={props.uuid}
      />
    </div>
  );
}
