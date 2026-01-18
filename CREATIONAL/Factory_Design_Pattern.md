# Factory Method Design Pattern

## What Is the Factory Design Pattern?

The **Factory Design Pattern** is used when we **do not want to handle the creation of an object all by ourselves**.

Instead of directly creating objects using `new`, we create a **factory** and ask it to create the object for us.

In simple words:

* The client requests a product
* The factory creates the product
* The client uses the product

The client never worries about **how** or **which exact class** is being created.

---

## Why Do We Need a Factory?

If we create objects directly, our code becomes:

* Hard to change
* Tightly coupled to specific classes
* Difficult to extend

Using a factory helps us:

* Move object creation to one place
* Keep client code simple
* Add new products without changing existing code

---

## Who Are the Main Players?

When using the Factory Method pattern, we define the following:

* **Client** – The user who wants a product
* **Factory (Parent class)** – Decides how products are created
* **Products** – The actual objects being created

The factory does not do the work itself.
It only **redirects us to the correct product class**.

---

## Restaurant Example (Easy to Imagine)

* Customer → Client
* Kitchen → Factory
* Chef → Subclass (Concrete Factory)
* Dish → Product

The customer does not cook the food.
The customer only places an order.

The kitchen decides:

* Which chef will cook
* How the dish is prepared

The dish is then returned to the customer.

---

## Simple Java Example

We will create a **burger ordering system**.

---

## Step 1: Product Interface

This defines what all burgers must do.

```java
public interface Burger {
    void prepare();
}
```

---

## Step 2: Concrete Products

Each burger knows how to prepare itself.

```java
public class AmericanBurger implements Burger {
    @Override
    public void prepare() {
        System.out.println("Preparing American Burger");
    }
}
```

```java
public class OrientalBurger implements Burger {
    @Override
    public void prepare() {
        System.out.println("Preparing Oriental Burger");
    }
}
```

---

## Step 3: Factory (Parent Class)

This class defines the **common flow** but does not decide which burger is created.

```java
public abstract class BurgerStore {

    protected abstract Burger createBurger();

    public void orderBurger() {
        Burger burger = createBurger();
        burger.prepare();
    }
}
```

Important:

* `createBurger()` is the factory method
* The parent class does not know which burger it is making

---

## Step 4: Concrete Factories (Subclasses)

Now the subclasses decide **which burger to create**.

```java
public class AmericanBurgerStore extends BurgerStore {
    @Override
    protected Burger createBurger() {
        return new AmericanBurger();
    }
}
```

```java
public class OrientalBurgerStore extends BurgerStore {
    @Override
    protected Burger createBurger() {
        return new OrientalBurger();
    }
}
```

Each subclass is responsible for **one type of product**.

---

## Step 5: Client Code

The client just places an order.

```java
public class Main {
    public static void main(String[] args) {
        BurgerStore store = new AmericanBurgerStore();
        store.orderBurger();

        store = new OrientalBurgerStore();
        store.orderBurger();
    }
}
```

The client:

* Never creates burgers directly
* Never knows which class is used

---

## What Is Really Happening?

1. Client chooses a store
2. Client places an order
3. Factory calls the subclass
4. Subclass creates the burger
5. Burger is prepared and returned

---

## When Is Factory Method Used?

This pattern is useful when:

* We do not want to create objects directly
* The exact type of object is decided later
* New product types will be added in the future

---

## Drawbacks of Factory Method

* More classes are created
* Code may look complex at first
* Harder to understand for beginners

---

## How These Drawbacks Are Handled

* Use this pattern only when needed
* Follow a clear folder structure
* Focus on understanding the flow, not memorizing code

---

## Beginner Takeaway

* Factory Method removes object creation from client code
* Subclasses decide which product is created
* Client code stays clean
* Makes programs easy to extend

---

## Why Are We Using the `abstract` Keyword?

The keyword `abstract` is used when something is **intentionally incomplete**.

In simple words:

* An abstract class is not meant to be used directly
* It exists to be **extended by other classes**

---

### Why Is the Factory Class Abstract?

```java
public abstract class BurgerStore {
    protected abstract Burger createBurger();

    public void orderBurger() {
        Burger burger = createBurger();
        burger.prepare();
    }
}
```

`BurgerStore` does not know which burger to create.
That decision depends on the type of store.

So we tell Java:

> "You cannot create an object of BurgerStore directly. Someone else must complete it."

This prevents incorrect usage like:

```java
new BurgerStore(); // not allowed
```

---

### Why Is `createBurger()` Abstract?

```java
protected abstract Burger createBurger();
```

This forces every subclass to **define its own way of creating a burger**.

If a subclass does not implement this method, Java throws a compile-time error.

This guarantees that:

* A burger will always be created
* The correct type of burger is decided by the subclass

---

## Difference Between `extends` and `implements`

This is one of the most important concepts in Java.

---

### What Does `implements` Mean?

`implements` is used with **interfaces**.

An interface only defines rules.

```java
interface Burger {
    void prepare();
}
```

When a class implements an interface, it promises to follow those rules.

```java
public class OrientalBurger implements Burger {
    public void prepare() {
        System.out.println("Preparing Oriental Burger");
    }
}
```

If `prepare()` is missing, the code will not compile.

---

### What Does `extends` Mean?

`extends` is used with **classes**.

```java
public class OrientalBurgerStore extends BurgerStore {
    protected Burger createBurger() {
        return new OrientalBurger();
    }
}
```

This means:

* The subclass inherits existing logic
* The subclass reuses `orderBurger()`
* The subclass only fills in the missing part

---

## Key Difference in Simple Words

| Keyword      | Used With         | Meaning          |
| ------------ | ----------------- | ---------------- |
| `extends`    | class → class     | Inherit behavior |
| `implements` | class → interface | Follow rules     |

---

## How This Fits Factory Method Pattern

* `Burger` (interface) defines what a product must do
* `BurgerStore` (abstract class) defines the workflow
* Subclasses decide which product is created

This separation keeps the design clean, flexible, and easy to extend.

---

## Final Beginner Takeaway

* `abstract` prevents incomplete usage
* `extends` is for reusing behavior
* `implements` is for enforcing rules
* Factory Method uses all three together intentionally
