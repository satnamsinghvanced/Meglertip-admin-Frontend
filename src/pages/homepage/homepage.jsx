import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAllHomepageSections,
  updateHomepageSection,
  clearMessages,
} from "../../store/slices/homepageSlice";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImageUploader from "../../UI/ImageUpload";

const HomePageEditor = () => {
  const dispatch = useDispatch();
  const { sections, is_loading, errors } = useSelector(
    (state) => state.homepage
  );

  const [hero, setHero] = useState({
    title: "",
    subtitle: "",
    backgroundImage: "",
    buttonText: "",
    ctaLink: "",
  });

  const [howItWorks, setHowItWorks] = useState({
    heading: "",
    cards: [{ title: "", icon: "", description: "" }],
  });

  const [articles, setArticles] = useState({ heading: "" });
  const [whyChoose, setWhyChoose] = useState({
    heading: "",
    cards: [{ title: "", icon: "", description: "" }],
  });

  const [city, setCity] = useState({ title: "", description: "" });
  const [pros, setPros] = useState([
    {
      title: "",
      description: [""],
      subHeading: "",
      image: "",
      imagePosition: "",
      buttonText: "",
    },
  ]);

  useEffect(() => {
    dispatch(fetchAllHomepageSections());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (sections.hero) setHero(sections.hero);
    if (sections["how-it-works"])
      setHowItWorks({
        heading: sections["how-it-works"].heading || "",
        cards: sections["how-it-works"].cards || [
          { title: "", icon: "", description: "" },
        ],
      });
    if (sections["articles-heading"])
      setArticles({ heading: sections["articles-heading"].heading || "" });
    if (sections["why-choose"])
      setWhyChoose({
        heading: sections["why-choose"].heading || "",
        cards: sections["why-choose"].cards || [
          { title: "", icon: "", description: "" },
        ],
      });
    if (sections.city)
      setCity({
        title: sections.city.title || "",
        description: sections.city.description || "",
      });
    if (sections.pros)
      setPros(
        sections.pros.length
          ? sections.pros
          : [
              {
                title: "",
                description: [""],
                subHeading: "",
                image: "",
                imagePosition: "",
                buttonText: "",
              },
            ]
      );
  }, [sections]);

  const saveHero = () => dispatch(updateHomepageSection("hero", hero));
 const saveHowItWorks = () => {
  dispatch(updateHomepageSection("how-it-works", howItWorks));
};



  const saveArticles = () =>
    dispatch(updateHomepageSection("articles-heading", articles));

const saveWhyChoose = () => {
  dispatch(updateHomepageSection("why-choose", whyChoose));
};
  const saveCity = () => dispatch(updateHomepageSection("city", city));
  const savePros = () =>
    dispatch(updateHomepageSection("pros", { prosSection: pros }));

  return (
    <div className=" min-h-screen space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Homepage</h1>

      {is_loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {errors && <p className="text-red-500">{errors.message}</p>}

          <Section title="Hero Section" onSave={saveHero}>
            <Input
              label="Title"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
            />
            <Input
              label="Subtitle"
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            />
            <ImageUploader
              label="Background Image"
              value={hero.backgroundImage}
              onChange={(imageUrl) =>
                setHero({ ...hero, backgroundImage: imageUrl })
              }
            />
            <Input
              label="Button Text"
              value={hero.buttonText}
              onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
            />
            <Input
              label="CTA Link"
              value={hero.ctaLink}
              onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
            />
          </Section>

          <Section title="How It Works" onSave={saveHowItWorks}>
            <Input
              label="Heading"
              value={howItWorks.heading}
              onChange={(e) =>
                setHowItWorks({ ...howItWorks, heading: e.target.value })
              }
            />
            <h3 className="font-semibold mt-3">Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {howItWorks.cards.map((card, i) => (
                <CardBlock
                  key={i}
                  index={i}
                  data={card}
                  setData={(updated) => {
                    const arr = [...howItWorks.cards];
                    arr[i] = updated;
                    setHowItWorks({ ...howItWorks, cards: arr });
                  }}
                  onDelete={() => {
                    const arr = howItWorks.cards.filter((_, idx) => idx !== i);
                    setHowItWorks({ ...howItWorks, cards: arr });
                  }}
                />
              ))}
            </div>
            <AddButton
              onClick={() =>
                setHowItWorks({
                  ...howItWorks,
                  cards: [
                    ...howItWorks.cards,
                    { title: "", icon: "", description: "" },
                  ],
                })
              }
            />
          </Section>

          <Section title="Articles Heading" onSave={saveArticles}>
            <Input
              label="Heading"
              value={articles.heading}
              onChange={(e) => setArticles({ heading: e.target.value })}
            />
          </Section>

          <Section title="Why Choose Meglertip" onSave={saveWhyChoose}>
            <Input
              label="Heading"
              value={whyChoose.heading}
              onChange={(e) =>
                setWhyChoose({ ...whyChoose, heading: e.target.value })
              }
            />
            <h3 className="font-semibold mt-3">Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyChoose.cards.map((card, i) => (
                <CardBlock
                  key={i}
                  index={i}
                  data={card}
                  setData={(updated) => {
                    const arr = [...whyChoose.cards];
                    arr[i] = updated;
                    setWhyChoose({ ...whyChoose, cards: arr });
                  }}
                  onDelete={() => {
                    const arr = whyChoose.cards.filter((_, idx) => idx !== i);
                    setWhyChoose({ ...whyChoose, cards: arr });
                  }}
                
                />
              ))}
            </div>

            <AddButton
              onClick={() =>
                setWhyChoose({
                  ...whyChoose,
                  cards: [
                    ...whyChoose.cards,
                    { title: "", icon: "", description: "" },
                  ],
                })
              }
            />
          </Section>

          <Section title="City Section" onSave={saveCity}>
            <Input
              label="Title"
              value={city.title}
              onChange={(e) => setCity({ ...city, title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={city.description}
              onChange={(e) =>
                setCity({ ...city, description: e.target.value })
              }
            />
          </Section>

          <Section title="Pros Section" onSave={savePros}>
            {pros.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 mb-6 bg-white shadow-sm"
              >
                <h4 className="font-semibold text-lg mb-3">Pro #{i + 1}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(e) => {
                      const arr = [...pros];
                      arr[i] = { ...arr[i], title: e.target.value };
                      setPros(arr);
                    }}
                  />
                  <Input
                    label="Sub Heading"
                    value={item.subHeading}
                    onChange={(e) => {
                      const arr = [...pros];
                      arr[i] = { ...arr[i], subHeading: e.target.value };
                      setPros(arr);
                    }}
                  />
                  <Input
                    label="Image URL"
                    value={item.image}
                    onChange={(e) => {
                      const arr = [...pros];
                      arr[i] = { ...arr[i], image: e.target.value };
                      setPros(arr);
                    }}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Image Position
                    </label>
                    <select
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      value={item.imagePosition}
                      onChange={(e) => {
                        const arr = [...pros];
                        arr[i] = { ...arr[i], imagePosition: e.target.value };
                        setPros(arr);
                      }}
                    >
                      <option value="" disabled>
                        Select Image Position
                      </option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                  <Input
                    label="Button Text"
                    value={item.buttonText}
                    onChange={(e) => {
                      const arr = [...pros];
                      arr[i] = { ...arr[i], buttonText: e.target.value };
                      setPros(arr);
                    }}
                  />
                </div>

                {/* Descriptions Section */}
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Descriptions
                  </h5>
                  {item.description.map((desc, j) => (
                    <div key={j} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => {
                          const arr = [...pros];
                          const newDescriptions = [...arr[i].description];
                          newDescriptions[j] = e.target.value;
                          arr[i] = { ...arr[i], description: newDescriptions };
                          setPros(arr);
                        }}
                        placeholder={`Description ${j + 1}`}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...pros];
                          const newDescriptions = arr[i].description.filter(
                            (_, idx) => idx !== j
                          );
                          arr[i] = { ...arr[i], description: newDescriptions };
                          setPros(arr);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...pros];
                      const newDescriptions = [...arr[i].description, ""];
                      arr[i] = { ...arr[i], description: newDescriptions };
                      setPros(arr);
                    }}
                    className="text-blue-500 text-sm mt-2 hover:underline"
                  >
                    + Add Description
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const arr = pros.filter((_, idx) => idx !== i);
                    setPros(arr);
                  }}
                  className="text-red-600 text-sm mt-4 hover:underline"
                >
                  Remove This Block
                </button>
              </div>
            ))}

            <AddButton
              onClick={() =>
                setPros([
                  ...pros,
                  {
                    title: "",
                    subHeading: "",
                    description: [""],
                    image: "",
                    imagePosition: "",
                    buttonText: "",
                  },
                ])
              }
            />
          </Section>
        </>
      )}
    </div>
  );
};
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {[...Array(4)].map((_, idx) => (
      <div
        key={idx}
        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4"
      >
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded w-24 mt-4"></div>
      </div>
    ))}
  </div>
);

const Section = ({ title, children, onSave }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <button
        onClick={onSave}
        className="bg-[#161925] text-white px-4 py-2 rounded-md"
      >
        Save
      </button>
    </div>
    <div className="grid gap-3">{children}</div>
  </div>
);

const Input = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "bg-white focus:ring-2 focus:ring-blue-400"
      }`}
    />
  </div>
);

const Textarea = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <textarea
      rows={3}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "bg-white focus:ring-2 focus:ring-blue-400"
      }`}
    />
  </div>
);

const CardBlock = ({ data, index, setData, onDelete }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500 font-medium">Card #{index + 1}</p>

        <button
          type="button"
          onClick={onDelete}
          className="p-2 rounded-md hover:bg-red-100 transition-colors"
        >
          <RiDeleteBin5Line className="text-red-600 text-xl" />
        </button>
      </div>

      <div className="space-y-3 mt-3">
        <Input
          label="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <ImageUploader
          label="Icon"
          value={data.icon}
          onChange={(imageUrl) => setData({ ...data, icon: imageUrl })}
        />
        <Textarea
          label="Description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </div>
    </div>
  );
};

const AddButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#161925] text-white px-4 py-2 rounded-md"
  >
    ➕ Add Another
  </button>
);

export default HomePageEditor;
